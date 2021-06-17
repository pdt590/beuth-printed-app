import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  View,
} from 'react-native';
import {
  Container,
  Header,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Content,
  Toast,
  Input,
  Form,
  Item,
  Label,
  Text,
} from 'native-base';
import Card from '../components/Card';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import Mqtt from 'sp-react-native-mqtt';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  addDevice,
  removeDevice,
  updateDevice,
} from '../store/actions/DeviceActions';

import {
  addDeviceName,
  removeDeviceName,
  updateDeviceName,
} from '../store/actions/DeviceNameActions';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.targetServiceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    this.targetCharacteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
    this.subscriptionMonitor = null;

    // Creating BLE Manager
    this.manager = new BleManager();

    this.connectionStatus = false;
    this.client = null;
    this.timerId = null;
    this.state = {
      visibleModal: false,
      selectedDeviceId: '',
      selectedDeviceName: '',
    };
  }

  // Setting info messages
  info(message) {
    this.setState({log: '[INFO] ' + message});
    console.log(this.state.log);
  }

  error(message) {
    this.setState({log: '[ERROR] ' + message});
    console.log(this.state.log);
  }

  componentDidUpdate(prevProps) {
    if (this.props.settings !== prevProps.settings) {
      this.disconnect();
      this.init();
    }
  }

  componentDidMount() {
    this.netinfoUnsubscribe = NetInfo.addEventListener((state) => {
      // TODO
      // There is Call twice issue
      //if (state.type === 'wifi') {
      if (state.isConnected) {
        console.log('You are online!');
        if (this.connectionStatus !== state.isConnected) {
          // Waiting for Powered On state in iOS
          if (Platform.OS === 'ios') {
            this.manager.onStateChange((state) => {
              if (state === 'PoweredOn') this.init();
            });
          } else {
            this.init();
            this.connectionStatus = state.isConnected;
          }
        }
      } else {
        console.log('You are offline!');
        this.connectionStatus = false;
        Toast.show({
          text: 'Wifi Disconnected',
          position: 'top',
          textStyle: {fontSize: 20, textAlign: 'center'},
          style: {top: '50%', marginLeft: 150, marginRight: 150, height: 100},
          type: 'danger',
          duration: 5000,
        });
      }
      //}
    });
  }

  componentWillUnmount() {
    if (this.netinfoUnsubscribe) {
      this.netinfoUnsubscribe();
      this.netinfoUnsubscribe = null;
      this.connectionStatus = false;
    }
  }

  randIdCreator() {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  }

  disconnect() {
    if (this.client) {
      console.log('Killing connection.');
      clearInterval(this.timerId);
      this.client.disconnect(); // this.client = null
    }
  }

  onError(error) {
    console.log(`MQTT onError: ${error}`);
    Toast.show({
      text: 'Check Internet Connection',
      position: 'top',
      textStyle: {fontSize: 20, textAlign: 'center'},
      style: {top: '50%', marginLeft: 150, marginRight: 150, height: 100},
      type: 'danger',
      duration: 5000,
    });
  }

  onConnectionOpened() {
    console.log('MQTT onConnectionOpened');
    Toast.show({
      text: 'Successfully',
      position: 'top',
      textStyle: {fontSize: 20, textAlign: 'center'},
      style: {top: '50%', marginLeft: 150, marginRight: 150, height: 100},
      type: 'success',
      duration: 5000,
    });
  }

  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed: ${err}`);
    Toast.show({
      text: 'Connection Closed',
      position: 'top',
      textStyle: {fontSize: 20, textAlign: 'center'},
      style: {top: '50%', marginLeft: 150, marginRight: 150, height: 100},
      type: 'warning',
      duration: 5000,
    });
  }

  onMessageArrived(message) {}

  init() {
    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this.onConnectionClosed = this.onConnectionClosed.bind(this);
    this.onError = this.onError.bind(this);
    this.onMessageArrived = this.onMessageArrived.bind(this);
    this.disconnect = this.disconnect.bind(this);

    const deviceId = this.randIdCreator().replace(/[^a-zA-Z0-9]+/g, '');
    const conProps = {
      uri: `mqtt://${this.props.settings.mqtt_server}:1883`,
      clientId: deviceId,
      auth: this.props.settings.mqtt_auth,
      user: this.props.settings.mqtt_user,
      pass: this.props.settings.mqtt_pass,
      clean: true, // clean session YES deletes the queue when all clients disconnect
    };
    Mqtt.createClient(conProps)
      .then((client) => {
        client.on('closed', this.onConnectionClosed);
        client.on('error', this.onError);
        client.on('message', this.onMessageArrived);
        client.on('connect', this.onConnectionOpened);
        client.connect();

        this.client = client;
        this.scanAndConnect(client);
        this.timerId = setInterval(
          this.onRefreshDeviceList.bind(this),
          Number(this.props.settings.device_list_refresh_interval) * 1000,
        );
      })
      .catch((err) => {
        console.error(`MQTT createtClient error: ${err}`);
      });
  }

  // BLE
  onUpdateDevice(device) {
    if (
      !this.props.devices.activeDevices.find(
        (activeDevice) => device.id === activeDevice.id,
      )
    ) {
      this.props.addDevice({
        ...device,
        updatedTime: Date.now(),
      });
      if (!this.props.deviceNames.infos.find((info) => device.id === info.id)) {
        this.props.addDeviceName({
          id: device.id,
          name: device.id,
        });
      }
    } else {
      this.props.updateDevice({
        ...device,
        updatedTime: Date.now(),
      });
    }
  }

  // Checking devices
  onRefreshDeviceList() {
    const activeDevices = this.props.devices.activeDevices;
    if (!activeDevices.length) return;
    for (const device of activeDevices) {
      const now = Date.now();
      if (
        now - device.updatedTime >
        Number(this.props.settings.device_alive_time) * 1000
      ) {
        this.props.removeDevice(device);
      }
    }
  }

  // Scanning devices
  scanAndConnect(mqttClient) {
    this.manager.startDeviceScan(null, null, (error, server) => {
      //this.info('Scanning...');
      if (error) {
        this.error('Error 01 - ' + error.message);
        return;
      }
      let deviceName = server.name;
      if (deviceName !== null && deviceName.includes('Clip')) {
        //this.manager.stopDeviceScan()
        server
          .connect({requestMTU: 256})
          .then((server) => {
            this.info('Discovering services and characteristics');
            return server.discoverAllServicesAndCharacteristics();
          })
          .then(
            (server) => {
              this.info('Setting notifications');

              let isTempHigh = false;
              let isGasHigh = false;
              let newGasAfterCalibration = 0;
              let isWetHigh = false;
              let newWetAfterCalibration = 0;

              let isHumHealthBad = false;

              // Accelerometer data process
              //
              //
              let axArray = [];
              let ayArray = [];
              let azArray = [];
              let minAx = 0;
              let minAy = 0;
              let minAz = 0;
              let axMove = true;
              let ayMove = true;
              let azMove = true;
              //
              //
              // End accelerometer data process

              this.subscriptionMonitor = server.monitorCharacteristicForService(
                this.targetServiceUUID,
                this.targetCharacteristicUUID,
                (error, characteristic) => {
                  if (error) {
                    this.error('Error 02 - ' + error.message);
                    if (this.subscriptionMonitor) {
                      this.subscriptionMonitor.remove();
                    }
                    return;
                  }
                  const buffer = new Buffer(characteristic.value, 'base64');
                  let stringData = buffer.toString();
                  let jsonData = JSON.parse(stringData);

                  // temp data process
                  if (jsonData.temp < 0) {
                    isTempHigh =
                      jsonData.temp < this.props.settings.temp_threshold
                        ? true
                        : false;
                  } else {
                    isTempHigh =
                      jsonData.temp > this.props.settings.temp_threshold
                        ? true
                        : false;
                  }

                  // gas calibration and data process
                  // gas_calibration should be gas value in normal condition
                  if (this.props.settings.gas_calibration != 0) {
                    if (jsonData.gas > this.props.settings.gas_calibration) {
                      newGasAfterCalibration = 0;
                    } else {
                      newGasAfterCalibration =
                        this.props.settings.gas_calibration - jsonData.gas;
                    }
                    isGasHigh =
                      newGasAfterCalibration > this.props.settings.gas_threshold
                        ? true
                        : false;
                  } else {
                    newGasAfterCalibration = jsonData.gas;
                    isGasHigh = false;
                  }

                  // wet calibration and data process
                  // wet_calibration should be dry adc value
                  if (this.props.settings.wet_calibration != 0) {
                    if (jsonData.wet > this.props.settings.wet_calibration) {
                      newWetAfterCalibration = 0;
                    } else {
                      newWetAfterCalibration =
                        this.props.settings.wet_calibration - jsonData.wet;
                    }
                    isWetHigh =
                      newWetAfterCalibration > this.props.settings.wet_threshold
                        ? true
                        : false;
                  } else {
                    newWetAfterCalibration = jsonData.wet;
                    isWetHigh = false;
                  }

                  // Accelerometer data process
                  //
                  //
                  if (
                    axArray.length >=
                    this.props.settings.human_check_interval / 5
                  ) {
                    minAx = axArray.sort((a, b) => a - b)[0];
                    axArray.forEach((e) => {
                      if (e - minAx >= this.props.settings.ax_threshold) {
                        axMove = true;
                      } else {
                        axMove = false;
                      }
                    });
                    axArray = [];
                  }
                  axArray.push(Math.abs(jsonData.ax));

                  if (
                    ayArray.length >=
                    this.props.settings.human_check_interval / 5
                  ) {
                    minAy = ayArray.sort((a, b) => a - b)[0];
                    ayArray.forEach((e) => {
                      if (e - minAy >= this.props.settings.ay_threshold) {
                        ayMove = true;
                      } else {
                        ayMove = false;
                      }
                    });
                    ayArray = [];
                  }
                  ayArray.push(Math.abs(jsonData.ay));

                  if (
                    azArray.length >=
                    this.props.settings.human_check_interval / 5
                  ) {
                    minAz = azArray.sort((a, b) => a - b)[0];
                    azArray.forEach((e) => {
                      if (e - minAz >= this.props.settings.az_threshold) {
                        azMove = true;
                      } else {
                        azMove = false;
                      }
                    });
                    azArray = [];

                    // check whether human moves or not after collecting enough data
                    axMove || ayMove || azMove
                      ? (isHumHealthBad = false)
                      : (isHumHealthBad = true);
                  }
                  azArray.push(Math.abs(jsonData.az));
                  //
                  //
                  // End accelerometer data process

                  let device = {
                    ...jsonData,
                    newGasAfterCalibration: newGasAfterCalibration,
                    newWetAfterCalibration: newWetAfterCalibration, // wet calibration
                    isTempHigh: isTempHigh,
                    isWetHigh: isWetHigh,
                    isGasHigh: isGasHigh,
                    isHumHealthBad: isHumHealthBad,
                  };

                  this.onUpdateDevice(device);

                  if (mqttClient) {
                    // send data to cloud
                    mqttClient.publish(
                      `sensors/${device.id}`,
                      JSON.stringify(device), // convert to string
                      0,
                      false,
                    );
                  }
                },
              );
            },
            (error) => {
              this.error('Error 03 - ' + error.message);
            },
          );
      }
    });
  }

  renderModalContent() {
    return (
      <View style={{flex: 1}}>
        <Form>
          <Item stackedLabel>
            <Label>Device ID</Label>
            <Input disabled placeholder={this.state.selectedDeviceId} />
          </Item>
          <Item stackedLabel last>
            <Label>Device Name</Label>
            <Input
              onChangeText={(newName) =>
                this.setState({selectedDeviceName: newName})
              }
              value={this.state.selectedDeviceName}
            />
          </Item>
          <Button
            block
            style={styles.button}
            onPress={() => {
              if (
                !this.props.deviceNames.infos.find(
                  (info) => this.state.selectedDeviceId === info.id,
                )
              ) {
                this.props.addDeviceName({
                  id: this.state.selectedDeviceId,
                  name: this.state.selectedDeviceName,
                });
              } else {
                this.props.updateDeviceName({
                  id: this.state.selectedDeviceId,
                  name: this.state.selectedDeviceName,
                });
              }
              this.setState({
                visibleModal: false,
              });
            }}>
            <Text>Save New Name</Text>
          </Button>
          <Button
            block
            style={styles.button}
            onPress={() => {
              this.props.removeDeviceName({
                id: this.state.selectedDeviceId,
                name: this.state.selectedDeviceName,
              });
              this.setState({
                visibleModal: false,
              });
            }}>
            <Text>Remove Name</Text>
          </Button>
          <Button
            block
            style={styles.button}
            onPress={() =>
              this.setState({
                visibleModal: false,
              })
            }>
            <Text>Close</Text>
          </Button>
        </Form>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button
              onPress={() => this.props.navigation.toggleDrawer()}
              transparent>
              <Icon
                type="FontAwesome"
                name="bars"
                style={{color: 'dimgrey', fontSize: 35}}></Icon>
            </Button>
          </Left>
          <Body>
            <Title style={{color: 'dimgrey', fontSize: 25}}>
              PRINTED CARE CLOUD
            </Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon
                type="FontAwesome"
                name="mixcloud"
                style={{color: 'dimgrey', fontSize: 40}}></Icon>
            </Button>
          </Right>
        </Header>
        <Content>
          <Modal
            transparent={false}
            visible={this.state.visibleModal}
            animationType="slide">
            {this.renderModalContent()}
          </Modal>
          <FlatList
            data={this.props.devices.activeDevices}
            extraData={this.props.devices}
            renderItem={({item}) => (
              <TouchableOpacity
                onLongPress={() => {
                  let deviceName = this.props.deviceNames.infos.find(
                    (info) => item.id === info.id,
                  )
                    ? this.props.deviceNames.infos.find(
                        (info) => item.id === info.id,
                      ).name
                    : item.id;
                  this.setState({
                    visibleModal: true,
                    selectedDeviceId: item.id,
                    selectedDeviceName: deviceName,
                  });
                }}>
                <Card
                  key={item.id}
                  device={item}
                  deviceNames={this.props.deviceNames.infos}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#54c740',
    margin: 10,
  },
});

const mapStateToProps = (state) => {
  const {devices, settings, deviceNames} = state;
  return {devices, settings, deviceNames};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addDevice,
      removeDevice,
      updateDevice,
      addDeviceName,
      removeDeviceName,
      updateDeviceName,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

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

    this.connectionStatus = false;
    this.client = null;
    this.timerId = null;
    this.state = {
      visibleModal: false,
      selectedDeviceId: '',
      selectedDeviceName: '',
    };
  }

  /**
   * FUNCTIONS
   */

  randIdCreator() {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  }

  // Updating device
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

  /**
   * END FUNCTIONS
   */

  componentDidUpdate(prevProps) {
    if (this.props.settings !== prevProps.settings) {
      this.disconnect();
      this.init();
    }
  }

  componentDidMount() {
    //this.init();
    this.netinfoUnsubscribe = NetInfo.addEventListener((state) => {
      // TODO
      // There is Call twice issue
      //if (state.type === 'wifi') {
      if (state.isConnected) {
        console.log('You are online!');
        if (this.connectionStatus !== state.isConnected) {
          this.init();
          this.connectionStatus = state.isConnected;
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

  disconnect() {
    if (this.client) {
      console.log('Killing connection.');
      clearInterval(this.timerId);
      this.client.disconnect();
    }
  }

  onError(error) {
    console.log(`MQTT onError: ${error}`);
    Toast.show({
      text: 'Error! Check Internet Connection',
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
    this.client.subscribe(this.props.settings.mqtt_subtopic, 0);
    clearInterval(this.timerId);
    this.timerId = setInterval(
      this.onRefreshDeviceList.bind(this),
      Number(this.props.settings.device_list_refresh_interval) * 1000,
    );
  }

  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed: ${err}`);
    clearInterval(this.timerId);
    Toast.show({
      text: 'Connection Closed',
      position: 'top',
      textStyle: {fontSize: 20, textAlign: 'center'},
      style: {top: '50%', marginLeft: 150, marginRight: 150, height: 100},
      type: 'warning',
      duration: 5000,
    });
  }

  onMessageArrived(message) {
    const device = JSON.parse(message.data);
    this.onUpdateDevice(device);
  }

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
        this.client = client;
        client.on('closed', this.onConnectionClosed);
        client.on('error', this.onError);
        client.on('message', this.onMessageArrived);
        client.on('connect', this.onConnectionOpened);
        client.connect();
      })
      .catch((err) => {
        console.error(`MQTT createtClient error: ${err}`);
      });
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
                  settings={this.props.settings}
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

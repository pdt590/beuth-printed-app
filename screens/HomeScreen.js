import React, {Component} from 'react';
import {StyleSheet, ScrollView, FlatList} from 'react-native';
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

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.connectionStatus = false;
    this.client = null;
    this.timerId = null;
  }

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
      this.client.disconnect();
    }
  }

  onError(error) {
    console.log(`MQTT onError: ${error}`);
    Toast.show({
      text: 'Error! Check Internet Connection',
      type: 'danger',
      duration: 5000,
    });
  }

  onConnectionOpened() {
    console.log('MQTT onConnectionOpened');
    Toast.show({
      text: 'Connect Successfully',
      type: 'success',
      duration: 5000,
    });
    this.client.subscribe(this.props.settings.mqtt_subtopic, 0);
    this.timerId = setInterval(
      this.onDevicesListener.bind(this),
      Number(this.props.settings.interval),
    );
  }

  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed: ${err}`);
    clearInterval(this.timerId);
    Toast.show({
      text: 'Connection Closed',
      type: 'warning',
      duration: 5000,
    });
  }

  onMessageArrived(message) {
    const device = JSON.parse(message.data);
    this.onMessageProcess(device);
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

  // Updating device
  onMessageProcess(device) {
    if (
      !this.props.devices.activeDevices.find(
        (activeDevice) => device.name === activeDevice.name,
      )
    ) {
      this.props.addDevice({
        ...device,
        updatedTime: Date.now(),
      });
    } else {
      this.props.updateDevice({
        ...device,
        updatedTime: Date.now(),
      });
    }
  }

  // Checking devices
  onDevicesListener() {
    const activeDevices = this.props.devices.activeDevices;
    if (!activeDevices.length) return;
    for (const device of activeDevices) {
      const now = Date.now();
      if (
        now - device.updatedTime >
        Number(this.props.settings.alive_time) * 1000
      ) {
        this.props.removeDevice(device);
      }
    }
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button
              onPress={() => this.props.navigation.toggleDrawer()}
              transparent>
              <Icon name="menu" style={{color: 'dimgrey', fontSize: 40}}></Icon>
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
                type="Entypo"
                name="icloud"
                style={{color: 'dimgrey', fontSize: 40}}></Icon>
            </Button>
          </Right>
        </Header>
        <Content>
          <FlatList
            data={this.props.devices.activeDevices}
            extraData={this.props.devices}
            renderItem={({item}) => (
              <Card
                key={item.id}
                device={item}
                settings={this.props.settings}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => {
  const {devices, settings} = state;
  return {devices, settings};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addDevice,
      removeDevice,
      updateDevice,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

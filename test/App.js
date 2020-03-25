import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {
  Container,
  Header,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import Mqtt from 'sp-react-native-mqtt';
import Card from './components/Card';

export default class App extends Component {
  constructor() {
    super();

    this.targetServiceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    this.targetCharacteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

    // Creating BLE Manager
    this.manager = new BleManager();

    // Creating MQTT Client
    this.client = null;

    // state
    this.state = {
      log: null,
      devices: {
        '01': {
          name: 'Mr. Muller',
          value: {
            state: 'up',
            temp: 23,
            pres: 100,
            hum: 50,
            gas: 60,
            alt: 90,
          },
          updatedTime: Date.now() - 1,
        },
        '02': {
          name: 'Ms. Martin',
          value: {
            state: 'up',
            temp: 23,
            pres: 100,
            hum: 50,
            gas: 60,
            alt: 90,
          },
          updatedTime: Date.now() - 2,
        },
        '03': {
          name: 'Mr. Jackson',
          value: {
            state: 'down',
            temp: 23,
            pres: 100,
            hum: 50,
            gas: 60,
            alt: 90,
          },
          updatedTime: Date.now() - 3,
        },
      },
    };
  }

  componentDidMount() {
    // Waiting for Powered On state in iOS
    if (Platform.OS === 'ios') {
      this.manager.onStateChange(state => {
        if (state === 'PoweredOn') this.init();
      });
    } else {
      this.init();
    }
  }

  //
  // MQTT
  //

  randIdCreator() {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  }

  disconnect() {
    if (this.client) {
      console.log('MQTT now killing open realtime connection.');
      this.client.disconnect();
    }
  }

  onError(error) {
    console.log(`MQTT onError: ${error}`);
  }

  onConnectionOpened() {
    console.log('MQTT onConnectionOpened');
    this.scanAndConnect(this.client);
  }

  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed: ${err}`);
  }

  onMessageArrived(message) {
    // TODO
  }

  init() {
    this.onConnectionOpened = this.onConnectionOpened.bind(this);
    this.onConnectionClosed = this.onConnectionClosed.bind(this);
    this.onError = this.onError.bind(this);
    this.onMessageArrived = this.onMessageArrived.bind(this);
    this.disconnect = this.disconnect.bind(this);

    const deviceId = this.randIdCreator().replace(/[^a-zA-Z0-9]+/g, '');
    const conProps = {
      uri: 'mqtt://141.64.29.79:1883',
      clientId: deviceId,
      auth: true,
      user: 'mqttuser',
      pass: 'mqttpassword',
      clean: true, // clean session YES deletes the queue when all clients disconnect
    };
    Mqtt.createClient(conProps)
      .then(client => {
        this.client = client;
        client.on('closed', this.onConnectionClosed);
        client.on('error', this.onError);
        client.on('message', this.onMessageArrived);
        client.on('connect', this.onConnectionOpened);
        client.connect();
      })
      .catch(err => {
        console.error(`MQTT createtClient error: ${err}`);
      });
  }

  //
  // End MQTT
  //

  //
  // BLE
  //

  // Setting info messages
  info(message) {
    this.setState({log: '[INFO] ' + message});
    console.log(this.state.log);
  }

  error(message) {
    this.setState({log: '[ERROR] ' + message});
    console.log(this.state.log);
  }

  // Updating value
  updateValue(key, value) {
    if (key in this.state.devices) {
      this.setState({
        devices: {
          ...this.state.devices,
          [key]: {
            name: this.state.devices[key].name,
            value: value,
            updatedTime: Date.now(),
          },
        },
      });
      //console.log('updateValue', this.state.devices)
    }
  }

  // Updating device
  updateDevice(device) {
    const key = device.id;
    if (!(key in this.state.devices)) {
      this.setState({
        devices: {
          ...this.state.devices,
          [key]: {
            name: device.name,
            value: null,
            updatedTime: Date.now(),
          },
        },
      });
      //console.log('updateDevice', this.state.devices)
    }
  }

  // Checking devices
  checkDevices() {
    if (this.state.devices === {}) return;
    Object.keys(this.state.devices).map(key => {
      const now = Date.now();
      if (now - this.state.devices[key].updatedTime > 20 * 1000) {
        this.removeDevice(key);
      }
    });
  }

  // Removing device
  removeDevice(key) {
    let oldDevicesList = JSON.parse(JSON.stringify(this.state.devices));
    delete oldDevicesList[key];
    const newDevicesList = JSON.parse(JSON.stringify(oldDevicesList));
    this.setState({devices: {...newDevicesList}});
  }

  // Scanning devices
  scanAndConnect(mqttClient) {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info('Scanning...');
      if (error) {
        this.error('error 01 - ' + error.message);
        return;
      }

      //this.checkDevices()

      const deviceName = device.name;
      if (deviceName !== null && deviceName.includes('ESP32')) {
        //this.manager.stopDeviceScan()

        device
          .connect({requestMTU: 256})
          .then(device => {
            this.info('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(
            device => {
              this.info('Setting notifications');
              this.updateDevice(device);
              device.monitorCharacteristicForService(
                this.targetServiceUUID,
                this.targetCharacteristicUUID,
                (error, characteristic) => {
                  if (error) {
                    this.error('error 02 - ' + error.message);
                    this.removeDevice(device.id);
                    return;
                  }
                  const buffer = Buffer.from(
                    characteristic.value,
                    'base64',
                  ).toString();
                  console.log(JSON.parse(buffer));
                  //const key = device.id
                  //this.updateValue(key, value)
                  //mqttClient.publish(`sensors/${deviceName}`, value.toString(), 0, false)
                },
              );
            },
            error => {
              this.error('error 03 - ' + error.message);
            },
          );
      }
    });
  }

  //
  // End BLE
  //

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button transparent>
              <Icon
                type="AntDesign"
                name="bars"
                style={{color: 'dimgrey', fontSize: 40}}></Icon>
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
          <ScrollView>
            {Object.keys(this.state.devices).map(key => {
              return <Card key={key} device={this.state.devices[key]} />;
            })}
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import MQTT from 'sp-react-native-mqtt';
import _ from 'underscore';

export default class App extends Component {

  constructor() {
    super()
    
    /* 

      BLE

    */
   
    this.manager = new BleManager()
    this.prefixUUID = "f000aa"
    this.suffixUUID = "-0451-4000-b000-000000000000"
    this.sensors = {
      0: "Temperature",
      1: "Accelerometer",
      2: "Humidity",
      3: "Magnetometer",
      4: "Barometer",
      5: "Gyroscope"
    }

    /* 

    MQTT

    */
    this.QOS = 1 // Only 0 and 1 supported by Rabbit
    this.state = {info: "", values: {}}
  }

  serviceUUID(num) {
    return this.prefixUUID + num + "0" + this.suffixUUID
  }

  notifyUUID(num) {
    return this.prefixUUID + num + "1" + this.suffixUUID
  }

  writeUUID(num) {
    return this.prefixUUID + num + "2" + this.suffixUUID
  }

  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "ERROR: " + message})
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...")
      console.log(device)

      if (error) {
        this.error(error.message)
        return
      }

      if (device.name === 'pdthang') {
        this.info("Connecting to ESP32")
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info("Setting notifications")
            return this.setupNotifications(device)
          })
          .then(() => {
            this.info("Listening...")
          }, (error) => {
            this.error(error.message)
          })
      } else {
        this.info("Connecting to BLE Devices")
        //this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info("Setting notifications")
            return this.setupNotifications(device)
          })
          .then(() => {
            this.info("Listening...")
          }, (error) => {
            this.error(error.message)
          })
      }
    });
  }

  async setupNotifications(device) {
    for (const id in this.sensors) {
      const service = this.serviceUUID(id)
      const characteristicW = this.writeUUID(id)
      const characteristicN = this.notifyUUID(id)

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service, characteristicW, "AQ==" /* 0x01 in hex */
      )

      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, characteristic.value)
      })
    }
  }

  /* 

    MQTT

  */
  randIdCreator() {
    const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  }

  create(userID, connectionProps = {}) {
    if (userID && connectionProps) {
      this.onConnectionOpened = this.onConnectionOpened.bind(this);
      this.onConnectionClosed = this.onConnectionClosed.bind(this);
      this.onError = this.onError.bind(this);
      this.onMessageArrived = this.onMessageArrived.bind(this);
      this.disconnect = this.disconnect.bind(this);

      const deviceId = this.randIdCreator().replace(/[^a-zA-Z0-9]+/g, '');

      this.conProps = _.extend(
        {
          clientId: `realtime.${userID}.${deviceId}`,
          channelToUse: `mqtt-subscription-realtime.${userID}`,
          auth: false,
          clean: true, // clean session YES deletes the queue when all clients disconnect
        },
        connectionProps,
      );

      /* create mqtt client */
      MQTT.createClient(this.conProps)
      .then(client => {
        this.client = client;
        client.on('closed', this.onConnectionClosed);
        client.on('error', this.onError);
        client.on('message', this.onMessageArrived);
        client.on('connect', this.onConnectionOpened);
        client.connect();
      })
      .catch(err => {
        console.error(`MQTT.createtClient error: ${err}`);
      });
    }
  }

  disconnect() {
    if (this.client) {
    console.log('Now killing open realtime connection.');
    this.client.disconnect();
    }
  }

  onError(error) {
    console.log(`MQTT onError: ${error}`);
  }

  onConnectionOpened() {
    // subscribe to the client channel
    this.client.subscribe(this.conProps.channelToUse, this.QOS);
    console.log('MQTT onConnectionOpened');
  }

  onConnectionClosed(err) {
    console.log(`MQTT onConnectionClosed ${err}`);
  }

  onMessageArrived(message) {
    if (message) {
      console.log(`MQTT New message: ${JSON.stringify(message)}`);
    }
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }

    this.create(
      'bob',
      {
        uri: 'mqtt://141.64.75.233:1883',
      },
    )
  }

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.titleContainter}>
          <Text style={styles.title}>PrintED Project</Text> 
        </View>
        <View style={styles.paraContainer}>
          <Text style={styles.tempLabel}>Temp</Text>
          <Text style={styles.tempText}>27C</Text>
        </View>
        <View style={styles.paraContainer}>
          <Text style={styles.humLabel}>Humidity</Text>
          <Text style={styles.humText}>50%</Text>
        </View>
        <View style={styles.paraContainer}>
          <Text style={{flex: 1, flexWrap: 'wrap'}}>{this.state.info}</Text>
          {Object.keys(this.sensors).map((key) => {
            return <Text key={key} style={{flex: 1, flexWrap: 'wrap'}}>
                    {this.sensors[key] + ": " + (this.state.values[this.notifyUUID(key)] || "-")}
                  </Text>
          })}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  screen : {
    justifyContent: 'center',
    alignContent:'center',
    padding: 50,
  },

  titleContainter: {
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'roboto',
    fontSize: 30,
    color: 'blue'
  },

  paraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },

  tempLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  tempText: {
    fontSize: 16
  },

  humLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  humText: {
    fontSize: 16
  }
});
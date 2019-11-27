import React, { Component } from 'react'
import { ScrollView } from 'react-native';

import { Container, Header, Button, Icon, Left, Body, Right, Title } from 'native-base'
import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'
import Card from './components/Card'

export default class App extends Component {

  constructor() {
    super()

    this.targetServiceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
    this.targetCharacteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

    // Creating BLE Manager
    this.manager = new BleManager()

    // state 
    this.state = {
      log: null,
      devices: {}
    }
  }

  componentDidMount() {
    // Waiting for Powered On state in iOS
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }
  }

  // Setting info messages
  info(message) {
    this.setState({log: "[INFO] " + message})
    console.log(this.state.log)
  }

  error(message) {
    this.setState({log: "[ERROR] " + message})
    console.log(this.state.log)
  }

  // Updating value
  updateValue(key, value) {
    if (key in this.state.devices)
    {
      this.setState({devices: {...this.state.devices, [key]: {
        name: this.state.devices[key].name,
        value: value,
        updatedTime: Date.now()
      }}})
    }
  }

  // Updating device
  updateDevice(key, name) {
    if (!(key in this.state.devices))
    {
      this.setState({devices: {...this.state.devices, [key]: {
        name: name,
        value: null,
        updatedTime: Date.now()
      }}})
      console.log('updateDevice', this.state.devices)
    }
  }

  // Checking devices
  checkDevices() {
    if(this.state.devices === {}) return
    Object.keys(this.state.devices).map((key) => {
      const now = Date.now()
      if((now -  this.state.devices[key].updatedTime) > 20*1000) {
        let oldDevicesList = JSON.parse(JSON.stringify(this.state.devices))
        delete oldDevicesList[key]
        const newDevicesList = JSON.parse(JSON.stringify(oldDevicesList))
        this.setState({devices: {...newDevicesList}})
      }
    })
  }

  // Removing device
  removeDevice(key) {
    let oldDevicesList = JSON.parse(JSON.stringify(this.state.devices))
    delete oldDevicesList[key]
    const newDevicesList = JSON.parse(JSON.stringify(oldDevicesList))
    this.setState({devices: {...newDevicesList}})
  }

  // Scanning devices
  scanAndConnect() {

    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...")
      if (error) {
        this.error(error.message)
        console.log('error 01')
        return
      }
      
      //this.checkDevices()

      const deviceName = device.name
      if (deviceName!== null && deviceName.includes("ESP32")) {
        //this.manager.stopDeviceScan()

        device.connect()
          .then((device) => {
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info("Setting notifications")
            this.updateDevice(device.id, device.name)
            device.monitorCharacteristicForService(this.targetServiceUUID, this.targetCharacteristicUUID, 
              (error, characteristic) => {
                if (error) {
                  this.error(error.message)
                  console.log('error 02')
                  this.removeDevice(device.id)
                  return
                }
                const buffer = new Buffer(characteristic.value, 'base64')
                this.updateValue(device.id, buffer.readInt32LE(0))
              })
          }, (error) => {
            this.error(error.message)
            console.log('error 03')
          }) 
      }
    });

  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button transparent>
              <Icon name='search' style={{color: 'dimgrey'}}> </Icon>  
            </Button>  
          </Left>
          <Body>
            <Title style={{color: 'dimgrey'}}>PrintED Station</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' style={{color: 'dimgrey'}}></Icon>
            </Button>
          </Right>  
        </Header>
        <ScrollView>
          {Object.keys(this.state.devices).map((key) => {
              return <Card key={key} value={this.state.devices[key].value} name={this.state.devices[key].name}/>
          })}
        </ScrollView>
      </Container>
    );
  }
}
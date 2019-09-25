import { BleManager } from 'react-native-ble-plx'

module.exports = {
  manager: new BleManager(),
  prefixUUID: "f000aa",
  suffixUUID: "-0451-4000-b000-000000000000",
  sensors: {
    0: "Temperature",
    1: "Accelerometer",
    2: "Humidity",
    3: "Magnetometer",
    4: "Barometer",
    5: "Gyroscope"
  },

  serviceUUID(num) {
    return this.prefixUUID + num + "0" + this.suffixUUID
  },
  notifyUUID(num) {
    return this.prefixUUID + num + "1" + this.suffixUUID
  },
  writeUUID(num) {
    return this.prefixUUID + num + "2" + this.suffixUUID
  },

  onInfo(message) {
    console.log(`BLE onInfo: ${message}`)
  },
  onError(error) {
    console.log(`BLE onError: ${error}`)
  },
  onUpdateValue(key, value) {
  },

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.onInfo("Scanning...")

      if (error) {
        this.onError(error.message)
        return
      }

      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        this.onInfo("Connecting to TI Sensor")
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            this.onInfo("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.onInfo("Setting notifications")
            return this.setupNotifications(device)
          })
          .then(() => {
            this.onInfo("Listening...")
          }, (error) => {
            this.onError(error.message)
          })
      }
    });
  },
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
          this.onError(error.message)
          return
        }
        this.onUpdateValue(characteristic.uuid, characteristic.value)
      })
    }
  }
}
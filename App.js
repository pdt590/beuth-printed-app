/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native';

import Mqtt from './connections/mqtt';
import Ble from './connections/ble';

// init mqtt
Mqtt.create(
  'bob',
  {
    uri: 'mqtt://141.64.75.233:1883',
  },
);

// init ble
if (Platform.OS === 'ios') {
  Ble.manager.onStateChange((state) => {
    if (state === 'PoweredOn') Ble.scanAndConnect()
  })
} else {
  Ble.scanAndConnect()
};

const App = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.titleContainter}>
        <Text style={styles.title}>PrintED Project</Text> 
      </View>
      <View style={styles.tempContainer}>
        <Text style={styles.tempLabel}>Temp</Text>
        <Text style={styles.tempText}>27C</Text>
      </View>
      <View style={styles.humContainer}>
        <Text style={styles.humLabel}>Humidity</Text>
        <Text style={styles.humText}>50%</Text>
      </View>
    </View>
  );
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

  tempContainer: {
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

  humContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  humLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  humText: {
    fontSize: 16
  }
});

export default App;

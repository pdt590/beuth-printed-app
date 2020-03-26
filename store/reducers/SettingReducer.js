import AsyncStorage from '@react-native-community/async-storage';
import {CHANGE_SETTING} from '../../constants/action_types';

let INITIAL_STATE = {
  mqtt_server: '192.168.2.162',
  mqtt_auth: false,
  mqtt_user: 'username',
  mqtt_pass: 'pass',
  targetServiceUUID: 'targetServiceUUID',
  targetCharacteristicUUID: 'targetCharacteristicUUID',
  temp_threshold: '1',
  pressure_threshold: '2',
  gas_threshold: '3',
  hum_threshold: '4',
};

const settingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_SETTING:
      const newState = action.payload;
      return newState;
    default:
      return state;
  }
};

export default settingReducer;

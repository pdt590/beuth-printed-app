import {CHANGE_SETTING} from '../../constants/action_types';

let INITIAL_STATE = {
  mqtt_server: '192.168.50.3',
  mqtt_auth: true,
  mqtt_user: 'mqttuser',
  mqtt_pass: 'mqttpassword',
  mqtt_subtopic: 'sensors/#',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',
  device_list_refresh_interval: '15',
  device_alive_time: '10',

  temp_threshold: '0',

  gas_threshold: '0',
  gas_calibration: '0',

  wet_threshold: '0',
  wet_calibration: '0',

  ax_threshold: '5',
  ay_threshold: '5',
  az_threshold: '5',
  human_check_interval: '60',

  //pressure_threshold: '0',
  //hum_threshold: '0',
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

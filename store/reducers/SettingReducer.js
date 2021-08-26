import {CHANGE_SETTING} from '../../constants/action_types';

let INITIAL_STATE = {
  mqtt_server: '141.64.29.79',
  mqtt_auth: true,
  mqtt_user: 'mqttuser',
  mqtt_pass: 'mqttpassword',
  mqtt_subtopic: 'sensors/#',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',
  device_list_refresh_interval: '30',
  device_alive_time: '20',
  temp_threshold: '10',
  pressure_threshold: '10',
  gas_threshold: '10',
  hum_threshold: '10',
  mois_threshold: '10',
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

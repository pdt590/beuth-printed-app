import {CHANGE_SETTING} from '../../constants/action_types';

let INITIAL_STATE = {
  mqtt_server: '141.64.29.79',
  mqtt_auth: true,
  mqtt_user: 'mqttuser',
  mqtt_pass: 'mqttpassword',
  mqtt_subtopic: 'sensors/test',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',
  interval: '20',
  alive_time: '15',
  temp_threshold: '0',
  pressure_threshold: '0',
  gas_threshold: '0',
  hum_threshold: '0',
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

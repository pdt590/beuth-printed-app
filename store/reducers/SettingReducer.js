import {CHANGE_SETTING} from '../../constants/action_types';

let INITIAL_STATE = {
  mqtt_server: '192.168.2.162',
  mqtt_auth: false,
  mqtt_user: '',
  mqtt_pass: '',
  mqtt_subtopic: 'devices/#',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',
  interval: '20',
  alive_time: '10',
  temp_threshold: '',
  pressure_threshold: '',
  gas_threshold: '',
  hum_threshold: '',
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

const INITIAL_STATE = {
  mqtt_server: '192.168.2.162',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',
  temp_threshold: '',
  pressure_threshold: '',
  gas_threshold: '',
  hum_threshold: '',
};

const settingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_SETTING':
    default:
      return state;
  }
};

export default settingReducer;

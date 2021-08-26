import {combineReducers} from 'redux';
import deviceReducer from './DeviceReducer';
import settingReducer from './SettingReducer';
import deviceNameReducer from './DeviceNameReducer'

export default combineReducers({
  settings: settingReducer,
  devices: deviceReducer,
  deviceNames: deviceNameReducer
});

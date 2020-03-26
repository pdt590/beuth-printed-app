import {combineReducers} from 'redux';
import deviceReducer from './DeviceReducer';
import settingReducer from './SettingReducer';

export default combineReducers({
  settings: settingReducer,
  devices: deviceReducer,
});

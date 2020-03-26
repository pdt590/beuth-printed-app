import React from 'react';
import {enableScreens} from 'react-native-screens';
import {Root} from 'native-base';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import deviceReducer from './store/reducers/DeviceReducer';
import settingReducer from './store/reducers/SettingReducer';

import Navigator from './navigation/Navigator';

enableScreens();

const rootReducer = combineReducers({
  settings: settingReducer,
  devices: deviceReducer
})

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <Root>
        <Navigator />
      </Root>
    </Provider>
  );
}

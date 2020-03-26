import React from 'react';
import {enableScreens} from 'react-native-screens';
import {Root} from 'native-base';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './store/reducers';

import Navigator from './navigation/Navigator';

enableScreens();

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

import React from 'react';
import {enableScreens} from 'react-native-screens';
import {Root} from 'native-base';
import {Provider} from 'react-redux';
import Navigator from './navigation/Navigator';
import { PersistGate } from 'redux-persist/integration/react';

enableScreens();

// Imports: Redux Persist Persister
import {store, persistor} from './store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root>
          <Navigator />
        </Root>
      </PersistGate>
    </Provider>
  );
}

import AsyncStorage from '@react-native-community/async-storage';
import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';

import rootReducer from './reducers';

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['settings', 'deviceNames'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['devices'],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
const store = createStore(persistedReducer);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

// Exports
export {store, persistor};

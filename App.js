import React from 'react';
import {enableScreens} from 'react-native-screens';
import {Root} from 'native-base';

import Navigator from './navigation/Navigator';

enableScreens();

export default function App() {
  return (
    <Root>
      <Navigator />
    </Root>
  );
}

import React from 'react';
import {useScreens} from 'react-native-screens';
import {Root} from 'native-base';

import Navigator from './navigation/Navigator';

useScreens();

export default function App() {
  return (
    <Root>
      <Navigator />
    </Root>
  );
}

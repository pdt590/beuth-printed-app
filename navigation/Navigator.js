import React from 'react';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import DrawerMenu from './components/DrawerMenu';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';

const DrawerNavigation = createDrawerNavigator(
  {
    HomeScreen: HomeScreen,
    SettingScreen: SettingScreen,
  },
  {
    initialRouteName: 'HomeScreen',
    drawerBackgroundColor: 'lightblue',
    contentOptions: {
      activeTintColor: 'red',
    },
    contentComponent: DrawerMenu,
  },
);

const Navigator = createSwitchNavigator({
  DrawerNavigation,
});

export default createAppContainer(Navigator);

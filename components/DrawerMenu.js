import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import { Icon } from 'native-base';

const menuData = [
  {icon: 'md-home', name: 'Home', screenName: 'HomeScreen', key: 1},
  {icon: 'md-settings', name: 'Setting', screenName: 'SettingScreen', key: 2}
];

const DrawerMenu = props => {
  return (
    <View style={styles.container}>
      <FlatList
        data={menuData}
        renderItem={({item}) => (
          <DrawerItem
            navigation={props.navigation}
            screenName={item.screenName}
            icon={item.icon}
            name={item.name}
            key={item.key}
          />
        )}
      />
    </View>
  );
};

const DrawerItem = ({navigation, icon, name, screenName}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() =>
      navigation.navigate(`${screenName}`, {isStatusBarHidden: false})
    }>
    <Icon name={icon} size={30} color="#333" style={{margin: 15}} />
    <Text style={styles.menuItemText}>{name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.43)',
    paddingTop: 70,
  },
  menuItem: {
    flexDirection: 'row',
  },
  menuItemText: {
    fontSize: 20,
    fontWeight: '500',
    margin: 15,
  }
});

export default DrawerMenu;

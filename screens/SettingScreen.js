import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Container,
  Header,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';

const SettingSceen = ({ navigation }) => {
  return (
    <Container>
      <Header>
        <Left>
          <Button onPress={() => navigation.toggleDrawer()} transparent>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>Header</Title>
        </Body>
        <Right />
      </Header>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default SettingSceen;



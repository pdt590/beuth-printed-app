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

const HomeSceen = ({navigation}) => {
  return (
    <Container>
      <Header style={{backgroundColor: 'white'}}>
        <Left>
          <Button onPress={() => navigation.toggleDrawer()} transparent>
            <Icon
              name="menu"
              style={{color: 'dimgrey', fontSize: 40}}></Icon>
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'dimgrey', fontSize: 25}}>
            PRINTED CARE CLOUD
          </Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon
              type="Entypo"
              name="icloud"
              style={{color: 'dimgrey', fontSize: 40}}></Icon>
          </Button>
        </Right>
      </Header>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default HomeSceen;

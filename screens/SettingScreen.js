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
  Content,
  Form,
  Item,
  Input,
  Label,
  Text,
  Separator,
} from 'native-base';

const SettingSceen = ({navigation}) => {
  return (
    <Container>
      <Header style={{backgroundColor: 'white'}}>
        <Left>
          <Button onPress={() => navigation.toggleDrawer()} transparent>
            <Icon name="menu" style={{color: 'dimgrey', fontSize: 40}}></Icon>
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'dimgrey', fontSize: 25}}>SETTING</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Form>
          <Separator bordered>
            <Text style={{fontSize: 15}}>CONNECT SETTING</Text>
          </Separator>
          <Item regular style={styles.input}>
            <Input placeholder="MQTT Server" />
          </Item>
          <Item regular style={styles.input}>
            <Input placeholder="BLE Service UUID Target" />
          </Item>
          <Item regular style={styles.input}>
            <Input placeholder="BLE Characteristic UUID Target" />
          </Item>
          <Separator bordered>
            <Text style={{fontSize: 15}}>DATA SETTING</Text>
          </Separator>
          <Item regular style={styles.input}>
            <Input placeholder="Temperature Threshold" />
          </Item>
          <Item regular style={styles.input}>
            <Input placeholder="Pressure Threshold" />
          </Item>
          <Item regular style={styles.input}>
            <Input placeholder="Gas Threshold" />
          </Item>
          <Item regular style={styles.input}>
            <Input placeholder="Humidity Threshold" />
          </Item>
        </Form>
        <Button block style={styles.button}>
          <Text>Save</Text>
        </Button>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  input: {
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#54c740',
    margin: 20,
  },
});

export default SettingSceen;

import React, {Component} from 'react';
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
  Text,
  Separator
} from 'native-base';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeSetting } from '../store/actions/SettingActions';

class SettingScreen extends Component {
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button onPress={() => this.props.navigation.toggleDrawer()} transparent>
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
  }
}

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

const mapStateToProps = state => {
  const {settings} = state;
  return {settings};
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    changeSetting
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
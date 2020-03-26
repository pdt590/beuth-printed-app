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
  ListItem,
  Switch,
  Item,
  Input,
  Text,
  Separator,
} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeSetting} from '../store/actions/SettingActions';

class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.settings};
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button
              onPress={() => this.props.navigation.toggleDrawer()}
              transparent>
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
              <Text style={{fontSize: 15}}>MQTT SETTING</Text>
            </Separator>
            <Item regular style={styles.input}>
              <Input
                placeholder="MQTT Server IP"
                onChangeText={newIp => this.setState({mqtt_server: newIp})}
                value={this.state.mqtt_server}
              />
            </Item>

            <ListItem style={styles.input}>
              <Body>
                <Text>Authentication?</Text>
              </Body>
              <Right>
                <Switch
                  value={this.state.mqtt_auth}
                  onValueChange={() =>
                    this.setState({mqtt_auth: !this.state.mqtt_auth})
                  }
                />
              </Right>
            </ListItem>

            <Item regular style={styles.input}>
              <Input
                placeholder="Username"
                disabled={!this.state.mqtt_auth}
                onChangeText={newUser => this.setState({mqtt_user: newUser})}
                defaultValue={this.state.mqtt_user}
              />
            </Item>
            <Item regular style={styles.input}>
              <Input
                placeholder="Password"
                disabled={!this.state.mqtt_auth}
                onChangeText={newPass => this.setState({mqtt_pass: newPass})}
                defaultValue={this.state.mqtt_pass}
              />
            </Item>

            <Separator bordered>
              <Text style={{fontSize: 15}}>BLE SETTING</Text>
            </Separator>
            <Item regular style={styles.input}>
              <Input
                placeholder="BLE Service UUID Target"
                onChangeText={newUUID =>
                  this.setState({targetServiceUUID: newUUID})
                }
                defaultValue={this.state.targetServiceUUID}
              />
            </Item>
            <Item regular style={styles.input}>
              <Input
                placeholder="BLE Characteristic UUID Target"
                onChangeText={newUUID =>
                  this.setState({targetCharacteristicUUID: newUUID})
                }
                defaultValue={this.state.targetCharacteristicUUID}
              />
            </Item>

            <Separator bordered>
              <Text style={{fontSize: 15}}>DATA SETTING</Text>
            </Separator>
            <Item regular style={styles.input}>
              <Input
                placeholder="Temperature Threshold"
                onChangeText={newThreshold =>
                  this.setState({temp_threshold: newThreshold})
                }
                defaultValue={this.state.temp_threshold}
              />
            </Item>
            <Item regular style={styles.input}>
              <Input
                placeholder="Pressure Threshold"
                onChangeText={newThreshold =>
                  this.setState({pressure_threshold: newThreshold})
                }
                defaultValue={this.state.pressure_threshold}
              />
            </Item>
            <Item regular style={styles.input}>
              <Input
                placeholder="Gas Threshold"
                onChangeText={newThreshold =>
                  this.setState({gas_threshold: newThreshold})
                }
                defaultValue={this.state.gas_threshold}
              />
            </Item>
            <Item regular style={styles.input}>
              <Input
                placeholder="Humidity Threshold"
                onChangeText={newThreshold =>
                  this.setState({hum_threshold: newThreshold})
                }
                value={this.state.hum_threshold}
              />
            </Item>
          </Form>
          <Button
            block
            style={styles.button}
            onPress={() => {
              console.log('SettingScreen', this.state);
              this.props.changeSetting(this.state);
            }}>
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSetting,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);

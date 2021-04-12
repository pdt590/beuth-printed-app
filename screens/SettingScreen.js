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
  Label,
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
              <Icon
                type="FontAwesome"
                name="bars"
                style={{color: 'dimgrey', fontSize: 35}}></Icon>
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
            <Item stackedLabel style={styles.input}>
              <Label>MQTT Server IP</Label>
              <Input
                onChangeText={(newIp) => this.setState({mqtt_server: newIp})}
                value={this.state.mqtt_server}
              />
            </Item>
            <Item stackedLabel style={styles.input}>
              <Label>Subscribe Topic</Label>
              <Input
                onChangeText={(newTopic) =>
                  this.setState({mqtt_subtopic: newTopic})
                }
                value={this.state.mqtt_subtopic}
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

            <Item stackedLabel style={styles.input}>
              <Label>Username</Label>
              <Input
                disabled={!this.state.mqtt_auth}
                onChangeText={(newUser) => this.setState({mqtt_user: newUser})}
                defaultValue={this.state.mqtt_user}
              />
            </Item>
            <Item stackedLabel style={styles.input}>
              <Label>Password</Label>
              <Input
                disabled={!this.state.mqtt_auth}
                onChangeText={(newPass) => this.setState({mqtt_pass: newPass})}
                defaultValue={this.state.mqtt_pass}
              />
            </Item>

            {/*             <Separator bordered>
              <Text style={{fontSize: 15}}>BLE SETTING</Text>
            </Separator>
            <Item stackedLabel style={styles.input}>
              <Label>BLE Service UUID Target</Label>
              <Input
                onChangeText={(newUUID) =>
                  this.setState({targetServiceUUID: newUUID})
                }
                defaultValue={this.state.targetServiceUUID}
              />
            </Item>
            <Item stackedLabel style={styles.input}>
              <Label>BLE Characteristic UUID Target</Label>
              <Input
                onChangeText={(newUUID) =>
                  this.setState({targetCharacteristicUUID: newUUID})
                }
                defaultValue={this.state.targetCharacteristicUUID}
              />
            </Item> */}

            <Separator bordered>
              <Text style={{fontSize: 15}}>DISPLAY SETTING</Text>
            </Separator>
            <Item stackedLabel style={styles.input}>
              <Label>Refreshed Device List Interval (s)</Label>
              <Input
                onChangeText={(newInterval) =>
                  this.setState({device_list_refresh_interval: newInterval})
                }
                defaultValue={this.state.device_list_refresh_interval}
              />
            </Item>
            {/* <Item stackedLabel style={styles.input}>
              <Label>Refreshed Device Time</Label>
              <Input
                onChangeText={(newTime) => this.setState({device_alive_time: newTime})}
                defaultValue={this.state.device_alive_time}
              />
            </Item> */}

            <Separator bordered>
              <Text style={{fontSize: 15}}>DATA SETTING</Text>
            </Separator>
            <Item stackedLabel style={styles.input}>
              <Label>Temperature Threshold (*C)</Label>
              <Input
                onChangeText={(newThreshold) =>
                  this.setState({temp_threshold: newThreshold})
                }
                defaultValue={this.state.temp_threshold}
              />
            </Item>
            {/*             <Item stackedLabel style={styles.input}>
              <Label>Pressure Threshold</Label>
              <Input
                onChangeText={(newThreshold) =>
                  this.setState({pressure_threshold: newThreshold})
                }
                defaultValue={this.state.pressure_threshold}
              />
            </Item> */}
            <Item stackedLabel style={styles.input}>
              <Label>Gas Threshold (Ohms)</Label>
              <Input
                onChangeText={(newThreshold) =>
                  this.setState({gas_threshold: newThreshold})
                }
                defaultValue={this.state.gas_threshold}
              />
            </Item>
            <Item stackedLabel style={styles.input}>
              <Label>Humidity Threshold (%)</Label>
              <Input
                onChangeText={(newThreshold) =>
                  this.setState({hum_threshold: newThreshold})
                }
                value={this.state.hum_threshold}
              />
            </Item>
            <Item stackedLabel style={styles.input}>
              <Label>Mois Threshold (&lt;100%)</Label>
              <Input
                onChangeText={(newThreshold) =>
                  this.setState({mois_threshold: newThreshold})
                }
                value={this.state.mois_threshold}
              />
            </Item>
          </Form>
          <Button
            block
            style={styles.button}
            onPress={() => {
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

const mapStateToProps = (state) => {
  const {settings} = state;
  return {settings};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeSetting,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);

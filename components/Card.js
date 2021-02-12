import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Content, Text, Icon, Thumbnail, Body} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';

export default class Card extends Component {
  render() {
    return (
      <Content padder>
        <Grid style={styles.card}>
          <Col size={2} style={styles.mainSection}>
            <Row>
              <Body>
                <Thumbnail
                  style={styles.avatar}
                  large
                  source={{
                    uri: 'https://picsum.photos/id/1027/600/600',
                  }}
                />
              </Body>
            </Row>
            <Row>
              <Body>
                <Text style={styles.userName}>{this.props.device.name}</Text>
              </Body>
            </Row>
          </Col>
          <Col size={3} style={styles.infoSection}>
            <Row>
              <Col style={styles.center}>
                <Row>
                  {/* Temp */}
                  <Icon
                    type="FontAwesome5"
                    name="thermometer-half"
                    style={{
                      color:
                        this.props.device.temp >
                        Number(this.props.settings.temp_threshold)
                          ? 'red'
                          : 'dimgray',
                      fontSize: 90,
                      height: 100,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text>(Temp) {this.props.device.temp} °C</Text>
                  </Body>
                </Row>
              </Col>
              <Col style={styles.center}>
                <Row>
                  {/* Position */}
                  <Icon
                    type="MaterialIcons"
                    name="airline-seat-flat-angled"
                    style={{
                      color: 'dimgray',
                      fontSize: 90,
                      height: 100,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text>(Position) Sleep</Text>
                  </Body>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col style={styles.center}>
                <Row>
                  {/* Gas */}
                  <Icon
                    type="Entypo"
                    name="air"
                    style={{
                      color:
                        this.props.device.gas >
                        Number(this.props.settings.gas_threshold)
                          ? 'red'
                          : 'dimgray',
                      fontSize: 90,
                      height: 100,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text>(Gas) {this.props.device.gas} Ohms</Text>
                  </Body>
                </Row>
              </Col>
              <Col style={styles.center}>
                <Row>
                  {/* Hum */}
                  <Icon
                    type="Entypo"
                    name="water"
                    style={{
                      color:
                        this.props.device.hum >
                        Number(this.props.settings.hum_threshold)
                          ? 'red'
                          : 'dimgray',
                      fontSize: 90,
                      height: 100,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text>(Humidity) {this.props.device.hum} %</Text>
                  </Body>
                </Row>
              </Col>
            </Row>
          </Col>
        </Grid>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    margin: 5,
    borderColor: '#FFF',
    position: 'relative',
  },
  mainSection: {
    backgroundColor: '#54c740',
    height: 300,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingTop: 60,
  },
  ringIcon: {
    position: 'absolute',
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 180,
  },
  userName: {
    fontSize: 25,
    color: 'white',
  },
  infoSection: {
    backgroundColor: 'white',
    height: 300,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
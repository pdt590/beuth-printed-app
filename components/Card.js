import React, {Component} from 'react';
import {StyleSheet, Image, View} from 'react-native';
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
                  source={require(`../design/avatars/no_profile.png`)}
                />
              </Body>
            </Row>
            <Row>
              <Body>
                <Text style={styles.userName}>
                  {this.props.deviceNames.find(
                    (info) => info.id === this.props.device.id,
                  )
                    ? this.props.deviceNames.find(
                        (info) => info.id === this.props.device.id,
                      ).name
                    : this.props.device.id}
                </Text>
              </Body>
            </Row>
          </Col>
          <Col size={3} style={styles.infoSection}>
            <Row>
              {/* Temp */}
              <Col style={styles.center}>
                <Row>
                  <Icon
                    type="FontAwesome5"
                    name="thermometer-half"
                    style={{
                      color: this.props.device.isTempHigh ? 'red' : 'dimgray',
                      fontSize: 80,
                      height: 90,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text
                      style={{
                        fontSize: 12,
                      }}>
                      (Temp) {this.props.device.temp.toFixed(2)} °C
                    </Text>
                  </Body>
                </Row>
              </Col>
              {/* Gas */}
              <Col style={styles.center}>
                <Row>
                  <Icon
                    type="Entypo"
                    name="air"
                    style={{
                      color: this.props.device.isGasHigh ? 'red' : 'dimgray',
                      fontSize: 80,
                      height: 90,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text
                      style={{
                        fontSize: 12,
                      }}>
                      (Gas) {this.props.device.gas.toFixed(2)} Ohms
                    </Text>
                  </Body>
                </Row>
              </Col>
            </Row>
            <Row>
              {/* Triple-Axis */}
              <Col style={styles.center}>
                <Row>
                  <Icon
                    type="MaterialIcons"
                    name="airline-seat-flat-angled"
                    style={{
                      color: this.props.device.isHumHealthBad
                        ? 'red'
                        : 'dimgray',
                      fontSize: 80,
                      height: 90,
                    }}></Icon>
                </Row>
                <Row>
                  <Body>
                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                      }}>
                      (Axis) {'\n'} {this.props.device.ax.toFixed(2)}\
                      {this.props.device.ay.toFixed(2)}\
                      {this.props.device.az.toFixed(2)}
                    </Text>
                  </Body>
                </Row>
              </Col>
              {/* Wet */}
              <Col style={styles.center}>
                <Row>
                  <Image
                    source={
                      this.props.device.isWetHigh
                        ? require('../design/icons/diaper-red.png')
                        : require('../design/icons/diaper.png')
                    }
                    style={styles.icon}
                  />
                </Row>
                <Row>
                  <Body>
                    <Text
                      style={{
                        fontSize: 12,
                      }}>
                      (Wet) {this.props.device.newWetAfterCalibration}
                    </Text>
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
  icon: {
    height: 80,
    width: 80,
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

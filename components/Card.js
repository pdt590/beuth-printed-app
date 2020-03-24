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
            {this.props.isAlarm ? (
              <Icon
                type="MaterialCommunityIcons"
                name="bell-ring"
                style={{
                  color: 'dimgray',
                  fontSize: 40,
                  position: 'absolute',
                  top: 10,
                  left: 10,
                }}></Icon>
            ) : null}
            <Row>
              <Body>
                <Thumbnail
                  style={styles.avatar}
                  large
                  source={{
                    uri: 'https://picsum.photos/id/237/600/600',
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
                {/* temp */}
                <Icon
                  type="FontAwesome5"
                  name="thermometer-half"
                  style={{
                    color: 'dimgray',
                    fontSize: 90,
                  }}></Icon>
              </Col>
              <Col style={styles.center}>
                {/* Action */}
                <Icon
                  type="MaterialIcons"
                  name="airline-seat-flat-angled" 
                  style={{
                    color: 'dimgray',
                    fontSize: 90,
                  }}></Icon>
              </Col>
            </Row>
            <Row>
              {/* Gas */}
              <Col style={styles.center}>
                <Icon
                  type="Entypo"
                  name="air"
                  style={{
                    color: 'dimgray',
                    fontSize: 90,
                  }}></Icon>
              </Col>
              <Col style={styles.center}>
                {/* Hum */}
                <Icon
                  type="Entypo"
                  name="water"
                  style={{
                    color: 'dimgray',
                    fontSize: 90,
                  }}></Icon>
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

/*
  // Action
  <Icon
    type="MaterialIcons"
    name="airline-seat-flat-angled"
    style={{
      color: 'dimgray',
      fontSize: 90,
    }}></Icon>
  
  // Temp
  <Icon
    type="FontAwesome5"
    name="thermometer-half"
    style={{
      color: 'dimgray',
      fontSize: 90,
    }}></Icon>
  
  // Pressure
  <Icon
    type="MaterialCommunityIcons"
    name="gauge"
    style={{
      color: 'dimgray',
      fontSize: 90,
    }}></Icon>

  <Icon
    type="Entypo"
    name="gauge"
    style={{
      color: 'dimgray',
      fontSize: 90,
    }}></Icon>
  
  // Air
  <Icon
    type="Entypo"
    name="air"
    style={{
      color: 'dimgray',
      fontSize: 90,
    }}></Icon>

  // Hum
  <Icon
    type="Entypo"
    name="water"
    style={{
      color: 'dimgray',
      fontSize: 90,
    }}></Icon>              
*/

/* 
  <Body>
    <Text style={{fontSize: 90, color: 'dimgray'}}>
      {this.props.device.value.state}°
    </Text>
  </Body>
  <Body>
    <Text style={{fontSize: 90, color: 'dimgray'}}>{this.props.device.value.temp}°</Text>
  </Body>
  <Body>
    <Text style={{fontSize: 90, color: 'dimgray'}}>{this.props.device.value.pres}°</Text>
  </Body>
  <Body>
    <Text style={{fontSize: 90, color: 'dimgray'}}>{this.props.device.value.hum}°</Text>
  </Body>
  <Body>
    <Text style={{fontSize: 90, color: 'dimgray'}}>{this.props.device.value.gas}°</Text>
  </Body>
  <Body>
    <Text style={{fontSize: 90, color: 'dimgray'}}>{this.props.device.value.alt}°</Text>
  </Body>
*/

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Text, Icon, Body} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class Card extends Component {
  render() {
    return (
      <Content padder>
        <Grid style={styles.card}>
          <Col size={1} style={styles.mainSection}>
            <Row >
              <Body>
                <Icon name='thermometer' style={{fontSize: 90, color: 'dimgray', paddingTop: 30}}></Icon>      
              </Body>
            </Row>
            <Row style= {{paddingTop: 15}}>
              <Body>
                <Text style={{fontSize: 70, color: 'dimgray'}}>{this.props.value}°</Text>
              </Body>
            </Row>
          </Col>
          <Col size={3} style={styles.infoSection}>
            <Row size={3}>
              <View>
                <Text style={{fontSize: 20, color: 'dimgray'}}>{this.props.name}</Text>
                <Text note style={{fontSize: 18}}>Berlin</Text>
              </View>
            </Row>
            <Row size={6} style= {{paddingBottom: 50}}>
              <Body>
              </Body>
            </Row>
            <Row size={1}>
              <Body>
                <Text style={{fontSize: 13}} note>09:30 AM</Text>
              </Body>
            </Row>
          </Col>
        </Grid>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    margin: 5,
    borderColor: '#FFF'
  },
  mainSection : {
    backgroundColor: 'yellowgreen', 
    height: 300,
    //display: "flex", 
    //alignItems: "center",
    //justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  infoSection: {
    backgroundColor: 'white',
    height: 300,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10
  }
})
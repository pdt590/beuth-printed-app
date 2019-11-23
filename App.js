import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Button, Icon, Left, Body, Right, Title } from 'native-base';

import Card from './components/Card'

export default class App extends Component {

  render() {
    
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Button transparent>
              <Icon name='search' style={{color: 'dimgrey'}}> </Icon>  
            </Button>  
          </Left>
          <Body>
            <Title style={{color: 'dimgrey'}}>PrintED Station</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' style={{color: 'dimgrey'}}></Icon>
            </Button>
          </Right>  
        </Header>
        <Card/>
      </Container>
    );
  }
}
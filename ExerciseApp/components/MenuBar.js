import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';

class MenuBar extends Component {
  render() {
    <Header 
        style={styles.toolbar}
        leftComponent={{icon: 'menu', color: '#fff',text: 'Map'}}/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    height: 40,
    backgroundColor: '#05a05a',
    textAlign: 'left',
    color: '#FFFFFF'
    },
});

export default Map
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import FBSDK,{LoginManager} from 'react-native-fbsdk';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  facebookLogin = ()=>{
    alert('hi')
    LoginManager.logInWithReadPermissions(['public_profile']).then(function(result){
        if(result.isCancelled)
          console.log('canceled')
        else
          console.log('success');
    },function(error){
      console.log("error "+error)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.facebookLogin}>
          <Text> login facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

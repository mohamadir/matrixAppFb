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
  Image,
  TouchableOpacity
} from 'react-native';
import FBSDK,{LoginManager,GraphRequest,GraphRequestManager,LoginButton,AccessToken} from 'react-native-fbsdk';



export default class App extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
       user: 'Stranger',
       loggedIn: false,
       picUrl:'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg'
    }
  }
  
 
  render() {
    return (
      <View style={styles.container}>
         <View style={styles.profileContainer}>
         <Text style={{fontSize:30,marginBottom: '10%'}}>Hello {this.state.user}</Text>
         <Image   
            style={styles.image}                  
            source={{uri: this.state.picUrl}}
          /> 
         {!this.state.loggedIn&&<Text style={{fontSize:10,marginBottom: 5}}>Please logg in to see the awesomness</Text> }
        </View>
        <LoginButton
    onLoginFinished={
      (error, result) => {
        if (error) {
         // alert("login has error: " + result.error);
        } else if (result.isCancelled) {
      //    alert("login is cancelled.");
        } else {

          AccessToken.getCurrentAccessToken().then(
            (data) => {
              let accessToken = data.accessToken
             // alert(accessToken.toString())

              const responseInfoCallback = (error, result) => {
                if (error) {
                  console.log(error)
                  alert('Error fetching data: ' + error.toString());
                } else {
                  console.log(result)
                  this.setState({user: result.first_name +" "+ result.last_name,picUrl: result.picture.data.url})
               //   alert('Success fetching data: ' + result.toString());
                  this.setState({loggedIn:true})
                }
              }

              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,middle_name,last_name,picture'
                    }
                  }
                },
                responseInfoCallback
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start()

            }
          )

        }
      }
    }
    onLogoutFinished={() => this.setState({user:'Stranger',picUrl:'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg',loggedIn:false})}/>
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
  profileContainer:{
    marginBottom: '50%',
    flexDirection: 'column',
    alignItems:   'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    height: 100,
    borderRadius: 50,
    width: 100,
    marginBottom: '10%',    
    alignItems: 'center'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

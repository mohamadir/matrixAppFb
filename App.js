/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {GoogleSignIn, GoogleSignInButton, GoogleSignin} from 'react-native-google-signin';
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
    // set the state variables 
    this.state = {
       user: 'Stranger',
       loggedIn: false,
       googleLogged: false,
       picUrl:'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg'
    }
  }
  // google login method , check if the user is logged in -> then log out 
  // if not , then log in 
  googleLogin=()=>{
    if(this.state.googleLogged)
    {
      GoogleSignin.signOut()
      .then(() => {
        console.log('out');
        this.setState({googleLogged: false,user:'Stranger',picUrl:'http://walyou.com/wp-content/uploads//2010/12/facebook-profile-picture-no-pic-avatar.jpg',loggedIn:false})
       })
      .catch((err) => {
      });
    }
    else{
    GoogleSignin.configure().then(()=>{
        GoogleSignin.signIn().then((user)=>{
          console.log(user)

          this.setState({googleLogged:true, picUrl: user.photo,user: user.givenName + " "+user.familyName,loggedIn:true})
        }).catch((error)=>{
          console.log(error)
        }).done();
      })
    }
  }
 
  render() {
    return (
      <View style={styles.container}>
         <View style={styles.profileContainer}>
         <Text style={{fontSize:20,marginBottom: '10%',marginTop: '10%'}}>Welcome {this.state.user}</Text>
         <Image   
            style={styles.image}                  
            source={{uri: this.state.picUrl}}
          /> 
         {!this.state.loggedIn&&<Text style={{fontSize:13,marginBottom: 5}}>Please logg in to see the awesomness</Text> }
        </View>
        <View style={styles.socialButtons}>

        
        {/* facebook login button  */}
       
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
      <TouchableOpacity onPress={this.googleLogin} style={styles.googleLogin}>
        <Text style={{textAlign:'center',height:'100%',flex: 1,marginTop: 5,color: 'white'}}> 
           Google+ {this.state.googleLogged? "התנתק מ": "התחבר באמצעות"}
        </Text>
      </TouchableOpacity>
    
      </View>
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
    height: 150,
    borderRadius: 100,
    width: 150,
    marginBottom: '10%',    
    alignItems: 'center'
  },
  socialButtons:{
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  googleLogin:{
      width: 200,
      height: 35,
      marginBottom: 5,
      borderRadius: 10,
      backgroundColor: 'red'

  },

  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

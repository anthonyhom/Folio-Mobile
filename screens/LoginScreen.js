import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';

import * as SecureStore from 'expo-secure-store';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)

    // Initialize our login state
    this.state = {
      email: '',
      password: ''
    }

    console.log(props)
  }
  // On our button press, attempt to login
  // this could use some error handling!
  onSubmit = () => {
    const { email, password } = this.state

    fetch("http://stark.cse.buffalo.edu/cse410/atam/api/SocialAuth.php", {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username: email,
        password
      })
    })
    .then(response => response.json())
    .then(json => {
      console.log(`Logging in with session token: ${json.user.session_token}`)

      // enter login logic here
      SecureStore.setItemAsync('session', json.user.session_token).then(() => {
        this.props.route.params.onLoggedIn();
      })

      console.log(`Logging in with user id: ${json.user.user_id}`)
      SecureStore.setItemAsync('user', json.user.user_id).then(() => {
        this.props.route.params.onLoggedIn();
      })

    })

  }

  render() {
    const { email, password } = this.state

    // this could use some error handling!
    // the user will never know if the login failed.
    return (
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss()
      }}>
      <View style={styles.container}>
        {/* <Text style={styles.loginText}>Login</Text> */}
        <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ email: text })}
          value={email}
          textContentType="emailAddress"
          placeholder="Email"
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ password: text })}
          value={password}
          textContentType="password"
          secureTextEntry={true}
          ref={(input) => { this.secondTextInput = input; }}
          placeholder="Password"
        />
        <Button title="Log In" onPress={() => this.onSubmit()} />
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

// Our stylesheet, referenced by using styles.container or styles.loginText (style.property)
const styles = StyleSheet.create({
  keyboardcontainer:{
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#eca400',
    padding: 30
  },
  logo: {
      resizeMode:"contain",
      width: 150,
      height:150
  },
  logoContainer: {
      alignItems:"center",
      marginBottom: 40
  },
  loginText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: '#fafafa',
    paddingHorizontal: 20
  }
});
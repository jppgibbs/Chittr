import React, {Component} from 'react';
import {Text, TextInput, View, Alert, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      user_id: '',
      x_auth: '',
      validation: '',
    };
  }

  // Store user in async
  async storeUser() {
    try {
      await AsyncStorage.setItem('user_id', JSON.stringify(this.state.user_id));
      let user_id = await AsyncStorage.getItem('user_id');
      await AsyncStorage.setItem('x_auth', JSON.stringify(this.state.x_auth));
      let x_auth = await AsyncStorage.getItem('x_auth');

      console.log('Stored in async. UID:' + user_id + ' xauth:' + x_auth);
    } catch (error) {
      console.log('Failed to store user. ' + error);
    }
  }

  // Login
  login = () => {
    console.log('Debug: Attempting login...');
    return fetch('http://10.0.2.2:3333/api/v0.0.5/login', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        // !!: Possibly redundant
        // Handle 2000 reply, if login was invalid
        if (response.status !== 200) {
          console.log('Debug: invalid login');
        }
        return response.json();
      })
      .then(responseJson => {
        // Login Success
        this.props.navigation.navigate('PostChits');
        this.setState({
          user_id: JSON.stringify(responseJson.id),
          x_auth: JSON.stringify(responseJson.token),
        });
        console.log('Login successful');
        this.storeUser();
        Alert.alert('Login Successful');
      })
      .catch(error => {
        console.log('Login error: \n' + error);
        this.setState({
          loggedIn: true,
          validation: 'Please enter a valid login',
        });
      });
  };

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.title}>Login</Text>

        <Text>Email Address</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => this.setState({email: text})}
          value={this.state.email}
          defaultValue="test@test.com"
          placeholder="example@example.com"
          textContentType="emailAddress"
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter email"
          accessibilityHint="Enter the email for the account you wish to login to"
        />
        <Text>Password</Text>
        <TextInput
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
          placeholder="Password"
          defaultValue="test"
          secureTextEntry
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter password"
          accessibilityHint="Enter the password for the account you wish to login to"
        />
        <Button title="Log in" onPress={() => this.login()} />
        <Button
          title="Create Account"
          onPress={() => {
            this.createAccount();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  button: {
    alignItems: 'center',
    padding: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
  },
});

export default Login;

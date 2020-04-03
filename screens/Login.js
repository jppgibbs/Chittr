import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

/*
## Login Screen
- This screen allows the user to log in to an account
*/

class Login extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user_id: '',
      x_auth: '',
    };
  }

  // Store user in async
  async storeUser() {
    try {
      await AsyncStorage.setItem('user_id', JSON.stringify(this.state.user_id));
      let user_id = await AsyncStorage.getItem('user_id');

      console.log('Stored in async. UID:' + user_id);
    } catch (error) {
      console.log('Failed to store user. ' + error);
    }
  }
  // Store auth token in async
  async storeToken() {
    try {
      await AsyncStorage.setItem('x_auth', JSON.stringify(this.state.x_auth));
      let x_auth = await AsyncStorage.getItem('x_auth');

      console.log('xauth: ' + x_auth);
    } catch (error) {
      console.log('Failed to store auth token ' + error);
    }
  }

  // Retrieve account data from Async storage
  async retrieveAsync() {
    try {
      // Retreieve from Async Storage
      const user_id = await AsyncStorage.getItem('user_id');
      const x_auth = await AsyncStorage.getItem('x_auth');
      // Parse into JSON
      const user_id_json = await JSON.parse(user_id);
      const x_auth_json = await JSON.parse(x_auth);
      this.setState({
        x_auth: x_auth_json,
        user_id: user_id_json,
      });
      console.log(
        'Debug: PostChit Loaded with uid: ' +
          this.state.user_id +
          ' auth key:' +
          this.state.x_auth,
      );
    } catch (e) {
      console.error(e);
    }
  }

  // Login
  login = () => {
    console.log('Debug: Attempting login...');
    return (
      // API Request
      fetch('http://10.0.2.2:3333/api/v0.0.5/login', {
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
          return response.json();
        })
        .then(responseJson => {
          // If login succeeds go home and store auth
          this.props.navigation.navigate('Home');
          this.setState({
            user_id: JSON.stringify(responseJson.id),
            x_auth: JSON.stringify(responseJson.token),
          });
          console.log('Debug: Login successful');
          this.storeUser();
          this.storeToken();
          Alert.alert('Login', 'Successfully Logged in');
          this.retrieveAsync();
          this.props.navigation.navigate('Account');
        })
        // If the login fails
        .catch(error => {
          console.log('Debug: Login error: \n' + error);
          Alert.alert('Login Failed', 'Please check your login details');
        })
    );
  };

  render() {
    return (
      <View style={styles.primaryView} accessible={true}>
        <Text style={styles.title} accessible={true} accessibilityRole="text">
          Login
        </Text>
        <Text
          style={styles.bodyText}
          accessible={true}
          accessibilityRole="text">
          Email Address
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({email: text})}
          value={this.state.email}
          defaultValue="test@test.com"
          placeholderTextColor="#918f8a"
          placeholder="example@example.com"
          textContentType="emailAddress"
          accessible={true}
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter email"
          accessibilityHint="Enter the email for the account you wish to login to"
        />
        <Text style={styles.bodyText} accessibilityRole="text">
          Password
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
          placeholderTextColor="#918f8a"
          placeholder="Password"
          defaultValue="test"
          secureTextEntry
          accessible={true}
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter password"
          accessibilityHint="Enter the password for the account you wish to login to"
        />

        <TouchableOpacity
          onPress={() => this.login()}
          style={styles.button}
          accessible={true}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityLabel="Log in"
          accessibilityHint="Press this to confirm your details and log into your account">
          <Text style={styles.bodyText}>Log In</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessible={true} accessibilityRole="text">
          Don't have an account?
        </Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Register')}
          style={styles.button}
          accessible={true}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityLabel="Register"
          accessibilityHint="Register a new account">
          <Text style={styles.bodyText} accessibilityRole="text">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// Stylesheet
const styles = StyleSheet.create({
  primaryView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  button: {
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    marginTop: 5,
    marginBottom: 0,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: '#2296f3',
    marginLeft: 15,
    marginRight: 15,
  },
  textEntry: {
    alignItems: 'center',
    padding: 5,
    color: '#ffffff',
    marginTop: 5,
    marginBottom: 0,
    borderColor: '#2296f3',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: '#273341',
    elevation: 3,
    marginLeft: 15,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    marginTop: 25,
  },
  bodyText: {
    color: '#ffffff',
    marginLeft: 15,
    marginRight: 15,
  },
});

export default Login;

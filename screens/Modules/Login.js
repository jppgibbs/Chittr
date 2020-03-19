import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      userID: '',
      xauth: '',
      validation: '',
      profileData: [],
    };
  }

  // Store user in async
  async storeUser() {
    try {
      await AsyncStorage.setItem('userID', JSON.stringify(this.state.userID));
      let userID = await AsyncStorage.getItem('userID');
      await AsyncStorage('xauth', JSON.stringify(this.state.xauth));
      let xauth = await AsyncStorage.getItem('xauth');

      console.log('Stored in async. UID:' + userID + ' xauth:' + xauth);
    } catch (error) {
      console.log('Failed to store user. ' + error);
    }
  }

  // Store UserID
  storeUserId = async id => {
    // !!: storeID -> storeUserId
    try {
      // Get ID then Convert to JSON; use async to wait until promise is fulfilled
      console.log('User id = ', id);
      await AsyncStorage.setItem('@id', JSON.stringify(id));
    } catch (error) {
      console.log(error);
    }
  };

  // Store Login Token
  storeLoginToken = async token => {
    // !!: storeLogInToken -> storeLoginToken
    try {
      // Get login token; use async to wait until promise is fulfilled
      console.log('Login token = ', token);
      await AsyncStorage.setItem('@logintoken', token);
    } catch (e) {
      console.error(e);
    }
  };

  // Retrieve User ID
  retrieveUserId = async () => {
    // !!: retrieveID > retrieveUserId
    try {
      const value = await AsyncStorage.getItem('@id');

      // If field contains a value then set the userID to match it
      if (value !== null) {
        this.setState({userID: value});
        console.log(this.state.userID);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Login
  login = () => {
    console.log('Debug: Attempting login...');
    return (fetch('http://10.0.2.2:3333/api/v0.0.5/login'),
    {
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
        if (response.status != 200) {
          console.log('Debug: invalid login');
        }
        return response.json();
      })
      .then(responseJson => {
        // Login Success
        this.props.navigation.navigate('Home');
        this.setState({
          userID: JSON.stringify(responseJson.id),
          x_auth: JSON.stringify(responseJson.token),
        });
        console.log('Login successful');
        this.storeUserId();
        Alert.alert('Login Successful');
      })
      .catch(error => {
        console.log('Login error');
        this.setState({
          logginIn: true,
          validation: 'Please enter a valid login',
        });
      });
  };

  getProfileData(done) {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            profileData: responseJson,
          },
          () => {
            done();
          },
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.retrieveUserId();
  }

  render() {
      return (
        <View style={styles.viewStyle}>

          <Text style={style.title}>Login</Text>

          <Text>Email Address</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({email: text})}
            value={this.state.email}
            placeholder='example@example.com'
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
            placeholder='Password'
            secureTextEntry
            accessibilityComponentType="none"
            accessibilityRole="none"
            accessibilityLabel="Enter password"
            accessibilityHint="Enter the password for the account you wish to login to"
          />
          <Button
            title="Log In"
            onPress={() => {
              this.login();
            }}
          />
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
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  button: {
    alignItems: 'center'  
  },
});

export default Login;

import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class UserProfile extends Component {
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
  async retrieveAccount() {
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
          ' auth key: ' +
          this.state.x_auth,
      );
    } catch (e) {
      console.error(e);
    }
  }
  componentDidMount() {
    this.retrieveAccount();
  }

  // Logout
  async clearAccount() {
    try {
      await AsyncStorage.removeItem('x_auth');
      console.log('key removed');
    } catch (error) {
      console.log('Removing auth key failed: ' + error);
    }
  }
  Logout = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/logout', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'X-Authorization': this.state.x_auth,
        'Content-Type': 'application/json',
      },
    })
      .then(jsonResponse => {
        this.clearAccount();
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        console.log('Logout from server failed: ' + error);
      });
  };

  render() {
    // TODO: Hide options based on login state
    return (
      <View style={styles.AccountControls}>
        <Text style={styles.title}>Account</Text>

        <Text style={styles.bodyText}>Navigate your account settings:</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Register')}
          style={styles.button}>
          <Text style={styles.bodyText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Login')}
          style={styles.button}>
          <Text style={styles.bodyText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.Logout()} style={styles.button}>
          <Text style={styles.bodyText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  AccountControls: {
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
  },
  bodyText: {
    color: '#ffffff',
    marginLeft: 15,
    marginRight: 15,
  },
});

export default UserProfile;

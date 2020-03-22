import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class CreateAccount extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: '',
      user_id: '',
      validation: '',
      profileData: [],
    };
  }

  createAccount() {
    let res1 = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password,
    });

    console.log(res1);

    return fetch('http://10.0.2.2:3333/api/v0.0.5/user', {
      method: 'POST',
      body: res1,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        Alert.alert('Account Created');
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.title}>Create Account</Text>
        <Text>First Name</Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({given_name: text})}
          value={this.state.given_name}
        />
        <Text>Second Name</Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({family_name: text})}
          value={this.state.family_name}
        />
        <Text>Email</Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({email: text})}
          value={this.state.email}
          textContentType="emailAddress"
        />
        <Text>Password</Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry
        />
        <Text>Confirm Password</Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => this.createAccount()}
          style={styles.button}>
          <Text>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'aliceblue',
    margin: 15,
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
  },
  textEntry: {
    alignItems: 'center',
    padding: 5,

    marginTop: 5,
    marginBottom: 0,
    borderColor: '#2296f3',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  title: {
    fontSize: 18,
  },
});

export default CreateAccount;

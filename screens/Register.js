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
        if (response.status === 201) {
          Alert.alert('Account Created', 'Log in with your new account!');
          this.props.navigation.navigate('Account');
        } else {
          Alert.alert(
            'Creation Failed',
            'Account creation unsuccessful. Check your details.',
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.viewStyle} accessible={true}>
        <Text style={styles.title} accessibilityRole="text">
          Create Account
        </Text>
        <Text style={styles.bodyText} accessibilityRole="text">
          First Name
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({given_name: text})}
          value={this.state.given_name}
          placeholderTextColor="#918f8a"
          placeholder="John"
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="First Name"
          accessibilityHint="Enter your first name"
        />
        <Text style={styles.bodyText} accessibilityRole="text">
          Second Name
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({family_name: text})}
          value={this.state.family_name}
          placeholderTextColor="#918f8a"
          placeholder="Smith"
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Second Name"
          accessibilityHint="Enter your second name"
        />
        <Text style={styles.bodyText} accessibilityRole="text">
          Email
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({email: text})}
          value={this.state.email}
          textContentType="emailAddress"
          placeholderTextColor="#918f8a"
          placeholder="example@example.com"
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter email"
          accessibilityHint="Enter the email you wish to use for your account"
        />
        <Text style={styles.bodyText} accessibilityRole="text">
          Password
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry
          placeholderTextColor="#918f8a"
          placeholder="Password"
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter password"
          accessibilityHint="Enter the password you wish to use for your account"
        />
        <TouchableOpacity
          onPress={() => this.createAccount()}
          style={styles.button}>
          <Text style={styles.bodyText} accessibilityRole="text">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  button: {
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    marginTop: 5,
    marginBottom: 0,
    marginLeft: 15,
    marginRight: 15,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: '#2296f3',
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

export default CreateAccount;

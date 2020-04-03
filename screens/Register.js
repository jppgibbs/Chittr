import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

/*
## Edit Profile Screen
- Allows the user to create a new account using the details they enter
*/

class Register extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: '',
      user_id: '',
    };
  }

  // Use the items in the text box to post a new account
  createAccount() {
    let bodyContent = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password,
    });

    console.log(bodyContent);

    return fetch('http://10.0.2.2:3333/api/v0.0.5/user', {
      method: 'POST',
      body: bodyContent,
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
      <View style={styles.primaryView} accessible={true}>
        <Text style={styles.title} accessible={true} accessibilityRole="text">
          Create Account
        </Text>
        <Text
          style={styles.bodyText}
          accessible={true}
          accessibilityRole="text">
          First Name
        </Text>
        <TextInput
          style={styles.textEntry}
          onChangeText={text => this.setState({given_name: text})}
          value={this.state.given_name}
          placeholderTextColor="#918f8a"
          placeholder="John"
          accessible={true}
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
          accessible={true}
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
          accessible={true}
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
          accessible={true}
          accessibilityComponentType="none"
          accessibilityRole="none"
          accessibilityLabel="Enter password"
          accessibilityHint="Enter the password you wish to use for your account"
        />
        <TouchableOpacity
          onPress={() => this.createAccount()}
          style={styles.button}
          accessible={true}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityLabel="Create Account"
          accessibilityHint="Press this to create your account">
          <Text
            style={styles.bodyText}
            accessible={true}
            accessibilityRole="text">
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

export default Register;

import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar} from 'react-native-elements';

class UserProfile extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      given_name: '',
      family_name: '',
      loggedIn: '',
      user_id: '',
      profile_id: '',
      x_auth: '',
      validation: '',
      profileData: [],
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('secondary load');
      this.retrieveAccount();
    });
    console.log('first load');
    this.retrieveAccount();
  }
  async retrieveAccount() {
    try {
      // Get the user id that was selected from async
      const view_user_id = await AsyncStorage.getItem('view_user_id');
      // Parse into JSON
      const view_user_id_json = await JSON.parse(view_user_id);
      this.setState({
        view_user_id: view_user_id_json,
      });
      console.log(
        'Debug: View Other Account Loaded with uid: ' + this.state.view_user_id,
      );
      this.getProfileData();
    } catch (e) {
      console.error(e);
    }
  }
  getProfileData() {
    return fetch(
      'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.view_user_id,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            profileData: responseJson,
          },
          () => {
            console.log('Debug: Account retrieved profile async');
          },
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    console.log('Debug: Profile loaded for user');
    return (
      <View style={styles.AccountControls}>
        <Image
          source={{
            uri:
              'http://localhost:3333/api/v0.0.5/user/' +
              this.state.profileData.view_user_id +
              '/photo',
          }}
          style={styles.profilePic}
        />
        <Text style={styles.nameText}>
          {this.state.profileData.given_name}{' '}
          {this.state.profileData.family_name}
        </Text>
        <Text style={styles.detailText}>{this.state.profileData.email}</Text>
        <Text style={styles.detailText}>
          Account ID: {this.state.profileData.user_id}
        </Text>
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
  profilePic: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom: 15,
    backgroundColor: 'white',
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
  nameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 32,
    alignSelf: 'center',
  },
  detailText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
  },
});
export default UserProfile;

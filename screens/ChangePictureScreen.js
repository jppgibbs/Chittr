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
import {RNCamera} from 'react-native-camera';

// Component consists of the ability to take a picture and upload it as the users' profile image.
class ChangePictureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      x_auth: '',
    };
  }

  // Contains large camera view and a button to take a picture.
  render() {
    return (
      <View style={styles.mainView} accessible={true}>
        <Text style={styles.accountHeader}>Update Profile Picture</Text>

        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.captureView}
        />

        <TouchableOpacity
          onPress={this.takePhoto.bind(this)}
          style={styles.button}
          accessibilityLabel="Change Profile Picture"
          accessibilityHint="Press the button to change your profile picture"
          accessibilityRole="button">
          <Text style={{fontSize: 16}}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    );
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAccount();
    });
    this.retrieveAccount();
  }

  // Function loads the user ID and the x-auth token from async storage and stores in state.
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

  // Function takes a picture of the current selected preview. When the picture is taken, it is sent
  // via the API to upload the user's profile picture.
  takePhoto = async () => {
    const options = {quality: 1, base64: true};
    const data = await this.camera.takePictureAsync(options);

    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo', {
      method: 'POST',
      body: await this.camera.takePictureAsync(options),
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Authorization': JSON.parse(this.state.x_auth),
      },
    })
      .then(response => {
        this.props.navigation.goBack();
        console.log('Succesfully taken picture');
      })
      .catch(error => {
        console.error('Error taking picture. Log: ' + error);
      });
  };
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#c7ddf5',
    padding: 10,
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 3,
    elevation: 2,
  },
  accountHeader: {
    marginLeft: 65,
    fontSize: 30,
    marginBottom: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  captureView: {
    flex: 0,
    borderRadius: 5,
    padding: 240,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 10,
    elevation: 5,
  },
});

export default ChangePictureScreen;

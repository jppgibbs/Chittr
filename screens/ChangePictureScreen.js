import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera';

class EditProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x_auth: '',
      user_id: '',
      photo: null,
    };
  }
  // Get account info from async on first load and every subsequent navigation
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

  takePhoto = async () => {
    const options = {quality: 1, base64: true};
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo', {
      method: 'POST',
      body: await this.camera.takePictureAsync(options),
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Authorization': JSON.parse(this.state.x_auth),
      },
    })
      .then(response => {
        this.props.navigation.navigate('Account');
        console.log('Photo taken');
      })
      .catch(error => {
        console.error('Failed to take/store photo. Log: ' + error);
      });
  };

  render() {
    return (
      <View style={styles.primaryView} accessible={true}>
        <RNCamera
          captureAudio={false}
          style={styles.cameraFrame}
          ref={ref => {
            this.camera = ref;
          }}
        />
        <TouchableOpacity
          onPress={this.takePhoto.bind(this)}
          style={styles.button}>
          <Text style={styles.title}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  primaryView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
  },
  button: {
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: '#2296f3',
  },
  cameraFrame: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default EditProfilePic;

import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {RNCamera} from 'react-native-camera';
import {TouchableOpacity} from 'react-native-gesture-handler';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
    };
  }

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
        console.log('Photo taken');
      })
      .catch(error => {
        console.error('Error taking photo: ' + error);
      });
  };

  render() {
    return (
      <View style={styles.camContainer}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              this.takePhoto;
            }}
            style={styles.button}>
            <Text style={styles.title}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  camContainer: {flex: 1, flexDirection: 'column'},
  buttonContainer: {
    flex: 0,
    alignSelf: 'center',
    margin: 10,
  },
  button: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: '#2296f3',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default Camera;

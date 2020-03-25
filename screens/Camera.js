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

  //Camera Function
  takePhoto = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const imageRecieved = this.props.navigation.getParam(
        'imageRecieved',
        () => {},
      );
      const data = await this.camera.takePictureAsync(options);
      imageRecieved(data);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.takePhoto.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 16}}>CAPTURE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
  preview: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default Camera;

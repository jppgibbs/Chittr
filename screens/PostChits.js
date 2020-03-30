import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app requires access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

class PostChits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      x_auth: '',
      chit_content: '',
      lat: null,
      long: null,
      location: null,
      locationPermission: false,
      geotag: false,
      modalVisible: false,
    };
  }
  // Retrieve and parse user id and corresponding auth key from async storage
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
          ' auth key:' +
          this.state.x_auth,
      );
    } catch (e) {
      console.error(e);
    }
  }
  // Prompt user to log in if they have no auth
  async validate() {
    let x_auth_check = await AsyncStorage.getItem('x_auth');
    if (x_auth_check !== null) {
      console.log('Logged in');
      this.setState({validation: 'true'});
    } else {
      console.log('Not logged in');
      this.setState({validation: 'false'});
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAccount();
    });
    this.retrieveAccount();
    this.findCoordinates();
  }

  findCoordinates = () => {
    if (!this.state.locationPermission) {
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition(
      position => {
        const longitude = JSON.stringify(position.coords.longitude);
        const latitude = JSON.stringify(position.coords.latitude);
        this.setState({
          longitude: longitude,
          latitude: latitude,
        });
        console.log('Debug: Found location: ' + longitude + latitude);

        // let location = {
        //   longitude: this.longitude,
        //   latitude: this.latitude,
        // };
        // this.setState({location});
        // console.log(location);

        // Geocode
        // Geocoder.from(this.latitude, this.longitude).then(json => {
        //   console.log(json);
        //   let addressComponent = json.results[5].formatted_address;
        //   this.setState({
        //     location: addressComponent,
        //   });
        //   console.log(addressComponent);
        // });
      },
      error => {
        Alert.alert(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  // When Post Chit button is pressed
  postChit() {
    this.retrieveAccount();
    // Get current date and parse it
    var timestamp = Date.parse(new Date());
    // Format our request
    let request = JSON.stringify({
      chit_content: this.state.chit_content,
      timestamp: timestamp,
      location: {
        longitude: JSON.parse(this.state.longitude),
        latitude: JSON.parse(this.state.latitude),
      },
    });
    // Format the auth key for the header
    let headerAuth = JSON.parse(this.state.x_auth);
    if (this.state.chit_content !== '') {
      // Only post if value of chit is not null
      try {
        // Build JSON request
        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits', {
          method: 'POST',
          body: request,
          // Include auth key in the request headers
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': headerAuth,
          },
        })
          .then(response => {
            console.log(response);
            // Check if response is unauthorized to give user feedback
            if (response.status !== 401) {
              Alert.alert('Posted Chit!');
              console.log('Chit successfully posted');
              //this.props.navigation.navigate('Home');
            } else {
              Alert.alert('Failed to post. Please log in.');
              console.log('Chit failed to post');
            }
          })
          .catch(error => {
            console.error('Chit failed to post: ' + error);
          });
      } catch (error) {
        console.error('Chit failed to post: ' + error);
      }
    } else {
      Alert.alert('Cannot post blank chit');
      console.log('Debug: Rejected posting blank chit');
    }
  }

  postChitWithPhoto() {
    // TODO: Improve this to not show alerts (add nav to home to camera)
    this.postChit();
    this.props.navigation.navigate('Camera');
  }

  render() {
    // TODO: Visible character limit counter
    return (
      <View style={styles.mainView}>
        <Text style={styles.title}>Talk Chit:</Text>
        <TextInput
          style={styles.textEntry}
          placeholderTextColor="#918f8a"
          placeholder="Howl into the meaningless void known as Chittr"
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
          maxLength={141}
          onChangeText={text => this.setState({chit_content: text})}
        />
        <Text style={styles.bodyText}>141 character limit</Text>
        <TouchableOpacity onPress={() => this.postChit()} style={styles.button}>
          <Text style={styles.bodyText}>Post Chit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => this.props.navigation.navigate('Camera')}
          onPress={() => this.postChitWithPhoto()}
          style={styles.button}>
          <Text style={styles.bodyText}>Add Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
    justifyContent: 'center',
  },
  textEntry: {
    alignItems: 'center',
    padding: 5,
    color: '#ffffff',
    marginTop: 5,
    marginBottom: 0,
    borderColor: '#2296f3',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#273341',
    elevation: 3,
    marginLeft: 15,
    marginRight: 15,
    height: 80,
  },
  button: {
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    marginTop: 5,
    marginBottom: 0,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#2296f3',
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
export default PostChits;

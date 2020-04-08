import React, {Component} from 'react';
import {Text, View, Alert, StyleSheet, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import {Input, Button, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

/*
## Post Chits Screen
- Allows a logged in user to post a chit (With geolocation & timestamp)
- User can use the 'Post Chit and Photo' button to add a photo to their chit
- User can press the save draft button to save what they currently have written to the drafts list
*/

// Location permission prompt
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
      locationPermission: false,
      locationChecked: false,
    };
  }
  // Run whenever the component is first loaded
  componentDidMount() {
    // Run when this tab is navigated to to refresh location and any new account info
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAsync();
    });
    this.retrieveAsync();
    this.findCoordinates();
  }

  // Retrieve and parse user id and corresponding auth key from async storage
  async retrieveAsync() {
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

  // Get the user's current geolocation
  findCoordinates = () => {
    // If location permission is not already granted, prompt for it
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
    this.retrieveAsync();
    // Get current date and parse it
    var timestamp = Date.parse(new Date());
    // Format our request depending on if the user chose to include location
    if (this.state.locationChecked === true) {
      var request = JSON.stringify({
        chit_content: this.state.chit_content,
        timestamp: timestamp,
        location: {
          longitude: JSON.parse(this.state.longitude),
          latitude: JSON.parse(this.state.latitude),
        },
      });
    } else {
      var request = JSON.stringify({
        chit_content: this.state.chit_content,
        timestamp: timestamp,
      });
    }
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
              console.log('Chit successfully posted');
              // this.props.navigation.navigate('Home');
            } else {
              Alert.alert('Failed to post.', 'Please log in.');
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
      Alert.alert('Talk chit first!', 'Cannot post blank chit');
      console.log('Debug: Rejected posting blank chit');
    }
  }

  // Post chit then allow the user to take a picture to add to it
  postChitWithPhoto() {
    if (this.state.chit_content !== '') {
      this.postChit();
      this.props.navigation.navigate('Camera');
    } else {
      Alert.alert('Not yet!', 'Write your chit before adding a photo!');
    }
  }

  // Save draft button
  async saveDraft() {
    // Only run if the current chit text is not blank
    if (this.state.chit_content !== '') {
      try {
        let chit_draft = await AsyncStorage.getItem('chit_draft');
        // Check if there is already a stored draft arra
        if (chit_draft !== null) {
          let draftParsed = JSON.parse(chit_draft);
          await AsyncStorage.removeItem('chit_draft');
          const newChit = [
            {
              chit_content: this.state.chit_content,
            },
          ];
          let draftCombined = draftParsed.concat(newChit);
          await AsyncStorage.setItem(
            'chit_draft',
            JSON.stringify(draftCombined),
          );
        } else {
          // If chit_draft is empty then create a new array to store drafts in
          const draft = [
            // Set the value of the array to match what is currently in the text box
            {
              chit_content: this.state.chit_content,
            },
          ];
          await AsyncStorage.setItem('chit_draft', JSON.stringify(draft));
        }
        console.log(
          'Draft list updated: ' + (await AsyncStorage.getItem('chit_draft')),
        );
      } catch (error) {
        console.log('Failed to update draft list: ' + error.message);
      }
    } else {
      Alert.alert('Talk chit first!', 'Cannot save blank chit to drafts');
      console.log('(Drafts): Rejected saving blank chit to drafts');
    }
  }

  render() {
    return (
      <View style={styles.primaryView} accessible={true}>
        <Text style={styles.title} accessible={true} accessibilityRole="text">
          Talk Chit:
        </Text>
        <Input
          inputStyle={styles.composeChit}
          inputContainerStyle={styles.composeChitContainer}
          placeholderTextColor="#918f8a"
          placeholder="Howl violently into the meaningless void known as Chittr"
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
          maxLength={141}
          onChangeText={text => this.setState({chit_content: text})}
          accessible={true}
          accessibilityLabel="Write your chit"
          accessibilityHint="Type out your chit here"
        />
        <Text
          style={styles.bodyText}
          accessible={true}
          accessibilityRole="text">
          141 character limit
        </Text>
        <CheckBox
          title="Add Location"
          checkedTitle={
            'Posting location: ' +
            this.state.latitude +
            ', ' +
            this.state.longitude
          }
          onPress={() =>
            this.setState({locationChecked: !this.state.locationChecked})
          }
          iconLeft
          iconType="material"
          checkedIcon="location-on"
          uncheckedIcon="location-off"
          checkedColor="green"
          checked={this.state.locationChecked}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.bodyText}
          accessible={true}
          accessibilityRole="checkbox"
          accessibilityLabel="Add location"
          accessibilityHint="Toggle whether you want to include your location"
        />
        <View style={styles.buttonGridContainer}>
          <Button
            onPress={() => this.postChit()}
            buttonStyle={styles.button}
            title="  Post"
            accessible={true}
            icon={
              <Icon
                name="paper-plane"
                size={18}
                color="white"
                style={styles.buttonIcon}
              />
            }
            accessibilityComponentType="button"
            accessibilityRole="button"
            accessibilityLabel="Post chit"
            accessibilityHint="Press here to post your chit"
          />
          <Button
            onPress={() => this.postChitWithPhoto()}
            buttonStyle={styles.buttonSmall}
            title=" "
            icon={
              <Icon
                name="camera"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
            }
            accessible={true}
            accessibilityComponentType="button"
            accessibilityRole="button"
            accessibilityLabel="Post chit with photo"
            accessibilityHint="Press here to post your chit with a photo"
          />
          <Button
            onPress={() => this.saveDraft()}
            buttonStyle={styles.button}
            title="  Save Draft"
            icon={
              <Icon
                name="save"
                size={18}
                color="white"
                style={styles.buttonIcon}
              />
            }
            accessible={true}
            accessibilityComponentType="button"
            accessibilityRole="button"
            accessibilityLabel="Create Account"
            accessibilityHint="Press this to create your account"
          />
          <Button
            onPress={() => this.props.navigation.navigate('My Drafts')}
            buttonStyle={styles.buttonSmall}
            title=" "
            icon={
              <Icon
                name="folder-open"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
            }
            accessible={true}
            accessibilityComponentType="button"
            accessibilityRole="button"
            accessibilityLabel="Create Account"
            accessibilityHint="Press this to create your account"
          />
        </View>
      </View>
    );
  }
}

// Stylesheet
const styles = StyleSheet.create({
  primaryView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
    justifyContent: 'center',
  },
  composeChit: {
    alignItems: 'center',
    padding: 5,
    color: '#ffffff',
    marginVertical: 8,
    backgroundColor: '#273341',
    marginHorizontal: 5,
    height: 100,
  },
  composeChitContainer: {
    backgroundColor: '#273341',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  checkboxContainer: {
    backgroundColor: '#17202b',
    borderWidth: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    // justifyContent: 'left',
  },
  buttonGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    marginVertical: 3,
    marginHorizontal: 4,
    width: 300,
  },
  buttonSmall: {
    alignItems: 'flex-end',
    width: 60,
    marginVertical: 3,
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

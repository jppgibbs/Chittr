import React, {Component} from 'react';

import {
  FlatList,
  ActivityIndicator,
  TextInput,
  Text,
  View,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card, Image, ListItem, Button, Divider} from 'react-native-elements';
import BackgroundTimer from 'react-native-background-timer';
import DatePicker from 'react-native-datepicker';

import Modal from 'react-native-modal';

// Check if user has location permissions, if not, prompt to allow it
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

class Drafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      draftList: [],
      user_id: '',
      x_auth: '',
      current_draft: '',
      array_index: 0,
      modalVisible: false,
      isDialogVisible: false,
      isScheduleDialogVisible: false,
      setShow: false,
      date: '',
    };
  }

  // #######################################
  //            LOADING DRAFTS
  // #######################################

  // Run when page first loads
  componentDidMount() {
    // Refresh drafts when tab is navigated to
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAsync();
    });
    this.retrieveAsync();
    this.findCoordinates();
    var date = Date.parse(new Date());
  }

  // Retrieve account data and drafts from Async storage
  async retrieveAsync() {
    try {
      // Retreieve from Async Storage
      const user_id = await AsyncStorage.getItem('user_id');
      const x_auth = await AsyncStorage.getItem('x_auth');
      const draftChits = await AsyncStorage.getItem('chit_draft');

      // Parse output into JSON
      const user_id_json = await JSON.parse(user_id);
      const x_auth_json = await JSON.parse(x_auth);
      const drafts_json = await JSON.parse(draftChits);

      // Set the state of the variables to parsed values
      this.setState({
        x_auth: x_auth_json,
        user_id: user_id_json,
        draftList: drafts_json,
      });
      // Print what we retrieved
      console.log(
        '(Drafts) User ID loaded: ' + JSON.stringify(this.state.user_id),
      );
      console.log(
        '(Drafts) x_auth Loaded: ' + JSON.stringify(this.state.x_auth),
      );
      console.log(
        '(Drafts) Drafts loaded: ' + JSON.stringify(this.state.draftList),
      );
    } catch (e) {
      console.error('(Drafts) Error retrieving from async: ' + e);
    }
  }

  // #######################################
  //       EDITING / DELETING DRAFTS
  // #######################################

  // Edit Draft in the Array
  async editDraft() {
    var drafts = this.state.draftList;
    drafts[this.state.array_index].chit_content = this.state.current_draft;
    this.setState({draftList: drafts});

    await AsyncStorage.setItem(
      'chit_draft',
      JSON.stringify(this.state.draftList),
    );
  }

  // Delete Draft in the Array
  async createDeleteDraftArray(index) {
    var drafts = this.state.draftList;
    console.log(index);
    drafts.splice(index, 1);
    this.setState({draftList: drafts});

    await AsyncStorage.setItem(
      'chit_draft',
      JSON.stringify(this.state.draftList),
    );
  }

  // #######################################
  //              POSTING
  // #######################################

  // Post a Draft
  postDraft(content) {
    this.retrieveAsync();
    console.log('Draft content: ' + content);
    // Get current date and parse it
    var timestamp = Date.parse(new Date());
    // Format our request
    let request = JSON.stringify({
      chit_content: content,
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
      Alert.alert('Talk chit first!', 'Cannot post blank chit');
      console.log('Debug: Rejected posting blank chit');
    }
  }

  // Get current coordinates for location posting
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

  // #######################################
  //           SCHEDULING DRAFTS
  // #######################################

  scheduleChit() {}

  // #######################################
  //              Interface
  // #######################################

  // Control edit modal visibility
  setDialogVisible(visible) {
    this.setState({isDialogVisible: visible});
  }

  // List Index
  setIndexAccessed(index) {
    this.setState({array_index: index});
  }

  // Show/Hide scheduler
  setTimePicker(visible) {
    this.setState({isScheduleDialogVisible: visible});
  }

  // Draw UI
  render() {
    console.log('(Drafts) Current Listed Drafts: ' + this.state.draftList);
    return (
      <View style={styles.mainView}>
        <FlatList
          style={styles.chitList}
          //keyExtractor={({chit_content}, timestamp) => chit_content.toString()}
          data={this.state.draftList}
          renderItem={({item, index}) => (
            <Card containerStyle={styles.chitContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.bodyText}>{item.chit_content}</Text>
                <Text>{'\n'}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  buttonStyle={styles.button}
                  title="POST"
                  type="outline"
                  onPress={() => this.postDraft(item.chit_content)} // delete draft when posted??
                />
                <Button
                  buttonStyle={styles.button}
                  title="EDIT"
                  type="outline"
                  onPress={() => {
                    this.setDialogVisible(!this.state.isDialogVisible);
                    this.setIndexAccessed(index);
                  }}
                />
                <Button
                  buttonStyle={styles.button}
                  title="DELETE"
                  type="outline"
                  onPress={() => {
                    this.createDeleteDraftArray(index);
                  }}
                />
                <Button
                  buttonStyle={styles.button}
                  title="SCHEDULE"
                  type="outline"
                  onPress={() => {
                    this.setTimePicker(!this.state.isScheduleDialogVisible);
                  }}
                />
              </View>
              <Modal
                animationType="slide"
                visible={this.state.isDialogVisible}
                testID={'modal'}
                backdropColor="#B4B3DB"
                backdropOpacity={0.2}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}>
                <View style={styles.modalContent}>
                  <Text style={styles.title}>Edit Draft</Text>
                  <TextInput
                    style={styles.textEntry}
                    defaultValue={
                      this.state.draftList[this.state.array_index].chit_content
                    }
                    autoCapitalize="sentences"
                    multiline
                    numberOfLines={4}
                    maxLength={141}
                    onChangeText={text => this.setState({current_draft: text})}
                  />
                  <Text style={styles.bodyText}>141 character limit</Text>
                  <Button
                    buttonStyle={styles.buttonModal}
                    testID={'edit-chit'}
                    onPress={() => this.editDraft()}
                    title="Edit Chit"
                  />
                  <Button
                    buttonStyle={styles.buttonModal}
                    testID={'close-button'}
                    onPress={() => {
                      this.setDialogVisible(!this.state.isDialogVisible);
                    }}
                    title="Close"
                  />
                </View>
              </Modal>
              <Modal
                animationType="slide"
                visible={this.state.isScheduleDialogVisible}
                testID={'Schedule-Modal'}
                backdropColor="#B4B3DB"
                backdropOpacity={0.2}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}>
                <View style={styles.modalContent}>
                  <Text style={styles.title}>Schedule Draft</Text>
                  <DatePicker
                    buttonStyle={styles.dateTimePicker}
                    style={styles.dateTimePicker}
                    date={this.state.date}
                    mode="time" // Limited to time only, modify to allow date scheduling
                    placeholder="Pick a time"
                    format="DD-MM-YYYY HH-mm"
                    onDateChange={date => {
                      this.setState({date: date});
                    }}
                  />
                  <Button
                    buttonStyle={styles.buttonModal}
                    testID={'schedule-button'}
                    onPress={() => {
                      this.scheduleChit();
                    }}
                    title="Schedule"
                  />
                  <Button
                    buttonStyle={styles.buttonModal}
                    testID={'close-button'}
                    onPress={() => {
                      this.setTimePicker(!this.state.isScheduleDialogVisible);
                    }}
                    title="Close"
                  />
                </View>
              </Modal>
            </Card>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  bodyText: {
    fontSize: 14,
    color: '#ffffff',
  },
  chitList: {
    // Flatlist style
    margin: 1,
    padding: 20,
  },
  chitContainer: {
    // Card container style
    margin: 1,
    padding: 20,
    borderRadius: 3,
    borderColor: '#3a444d',
    borderWidth: 2,
    backgroundColor: '#1b2734',
    elevation: 2,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  chitContent: {},
  buttonContainer: {
    flexDirection: 'row',
    flex: 3,
  },
  button: {
    padding: 5,
    marginHorizontal: 7,
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
  buttonModal: {
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  modalContent: {
    backgroundColor: '#006494',
    padding: 5,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 12,
  },
  dateTimePicker: {
    width: 300,
    alignSelf: 'center',
    color: '#ffffff',
  },
});

export default Drafts;

import React, {Component} from 'react';

import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ImagePlaceholder,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Image, ListItem, Button, Icon} from 'react-native-elements';

class GetChits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chitList: [],
      user_id: '',
      x_auth: '',
      given_name: '',
      family_name: '',
      chit_content: '',
      longitude: '',
      latitude: '',
    };
  }
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
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    // Refresh chits when tab is navigated to
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
      this.retrieveAccount();
    });
    this.getData();
    this.retrieveAccount();
  }

  getData() {
    // Connect to mudfoot server and retreieve data
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=5')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          chitList: responseJson,
        });
      })
      .catch(error => {
        console.log('Debug: error retreiving chits:' + error);
      });
  }

  // Update chit content
  setContent = text => {
    this.setState({
      chit_content: text,
    });
  };

  // Attempt at removing unloaded images from chit
  renderImage = chit_id => {
    // // Build JSON request
    // fetch('http://10.0.2.2:3333/api/v0.0.5/chits' + chit_id + '/photo').then(
    //   response => {
    //     // Check for 404
    //     // console.log(response);
    //     console.log(response);
    //     if (response !== null) {
    //       console.log(response.status + ' ' + chit_id + ' PASS: Image loaded');
    //       return (
    //         <Image
    //           resizeMode="cover"
    //           source={{
    //             uri:
    //               'http://10.0.2.2:3333/api/v0.0.5/chits/' + chit_id + '/photo',
    //           }}
    //           style={styles.chitImage}
    //         />
    //       );
    //     } else {
    //       console.log(response.status + ' ' + chit_id + ' FAIL: Not loaded');
    //       return <Text style={styles.title}>Not found</Text>;
    //     }
    //   },
    // );
  };

  // Draw UI
  render() {
    const {navigate} = this.props.navigation;
    if (this.state.isLoading) {
      // Show loading wheel if data isn't loaded yet
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.mainView}>
        <FlatList
          style={styles.chitMargin}
          data={this.state.chitList}
          renderItem={({item}) => (
            <Card
              containerStyle={styles.chitContainer}
              titleStyle={styles.title}
              title={
                <View style={styles.nameContainer}>
                  <Text style={styles.title}>
                    {item.user.given_name} {item.user.family_name}
                  </Text>
                  <View style={styles.timestampContainer} />
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              }
              imageProps={{
                resizeMode: 'cover',
                // containerStyle: styles.chitImage,
                placeholderStyle: styles.chitHideImage,
                PlaceholderContent: (
                  <View>
                    <ActivityIndicator />
                  </View>
                ),
              }}
              image={{
                uri:
                  'http://10.0.2.2:3333/api/v0.0.5/chits/' +
                  item.chit_id +
                  '/photo',
              }}>
              <Text style={styles.chitContent}>
                <Text>
                  {item.chit_content}
                  {'\n'}
                  {'\n'}
                </Text>
                {'\n'}
                {item.location == undefined ? (
                  (item.location = 'No Location Provided')
                ) : (
                  <Text style={styles.timestamp}>
                    {'Location: ' +
                      item.location.latitude +
                      ', ' +
                      item.location.longitude}
                  </Text>
                )}
              </Text>
              {this.renderImage(item.chit_id)}
            </Card>
          )}
          keyExtractor={({chit_id}, primarykey) => chit_id.toString()}
        />
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  timestampContainer: {flexGrow: 1},
  timestamp: {
    fontSize: 14,
    color: '#ffffff',
  },
  chitContainer: {
    margin: 1,
    padding: 20,
    borderRadius: 3,
    borderColor: '#3a444d',
    borderWidth: 2,
    backgroundColor: '#1b2734',
    elevation: 2,
    fontSize: 14,
    color: '#ffffff',
  },
  chitContent: {
    fontSize: 14,
    color: '#ffffff',
  },
  chitMargin: {
    margin: 1,
    padding: 20,
  },
  chitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chitImage: {},
  chitHideImage: {},
});

export default GetChits;

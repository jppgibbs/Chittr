import React, {Component} from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Avatar} from 'react-native-elements';

/*
## Home Screen
- This will be the first page the user lands on when they open the app.
- It displays all chits from accounts the user is following, sorting most recent first.
- A users name or profile picture can be pressed to navigate to their account screen
*/

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      chitList: [],
      photoList: [],
      user_id: '',
      x_auth: '',
    };
  }
  // Run whenever the component is first loaded
  componentDidMount() {
    // Run when this tab is navigated to to refresh chits and any new account info
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
      this.retrieveAsync();
    });
    this.getData();
    this.retrieveAsync();
  }

  // Retrieve account data from Async storage
  async retrieveAsync() {
    try {
      // Retreieve from Async Storage
      const user_id = await AsyncStorage.getItem('user_id');
      const x_auth = await AsyncStorage.getItem('x_auth');

      // Parse output into JSON
      const user_id_json = await JSON.parse(user_id);
      const x_auth_json = await JSON.parse(x_auth);
      this.setState({
        x_auth: x_auth_json,
        user_id: user_id_json,
      });
    } catch (e) {
      console.error('(Home) Error retrieving from async: ' + e);
    }
  }

  // Retrieve chits from the database
  getData() {
    // Connect to mudfoot server and retrieve data (start={Index to start from}; count={Number of chits to display})
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=10')
      .then(response => response.json())
      .then(responseJson => {
        // Once we have a JSON response stop displaying placeholder and update the chit list
        this.setState({
          loading: false,
          chitList: responseJson,
        });
      })
      .catch(error => {
        console.log('(Home) Error retreiving chits: ' + error);
      });
  }

  // Stores the selected user id in async storage and loads the corresponding profile
  goToProfile = async view_user_id => {
    try {
      await AsyncStorage.setItem('view_user_id', JSON.stringify(view_user_id));
      this.props.navigation.navigate('Search', {
        screen: 'Viewing Profile',
      });
    } catch (error) {
      console.log('(Home) Navigating to user profile' + error);
    }
  };

  // ## Attempt at removing image container from chits without an image
  // renderImage = chit_id => {
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
  // };

  // Draw UI
  render() {
    if (this.state.loading) {
      // Show loading wheel if data isn't loaded yet
      return (
        <View style={styles.primaryView}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.primaryView} accessible={true}>
        <FlatList
          // Create list to store individual chit cards inside
          style={styles.chitMargin}
          data={this.state.chitList}
          keyExtractor={({chit_id}) => chit_id.toString()}
          renderItem={({item}) => (
            <Card
              // Create chit cards to store chit content
              accessible={true}
              containerStyle={styles.chitContainer}
              titleStyle={styles.title}
              onRefresh={this.getData}
              title={
                <View style={styles.nameContainer}>
                  <Avatar
                    rounded
                    containerStyle={styles.avatarContainer}
                    onPress={() => this.goToProfile(item.user.user_id)}
                    source={{
                      uri:
                        'http://10.0.2.2:3333/api/v0.0.5/user/' +
                        item.user.user_id +
                        '/photo?timestamp=' +
                        Date.now(),
                    }}
                  />
                  <TouchableNativeFeedback
                    onPress={() => this.goToProfile(item.user.user_id)}>
                    <Text
                      style={styles.title}
                      accessible={true}
                      accessibilityRole="text">
                      {item.user.given_name} {item.user.family_name}
                    </Text>
                  </TouchableNativeFeedback>

                  <View style={styles.timestampContainer} />
                  <Text
                    style={styles.timestamp}
                    accessible={true}
                    accessibilityRole="text">
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              }
              imageProps={{
                resizeMode: 'cover',
                placeholderStyle: styles.phContainer,
              }}
              image={{
                uri:
                  'http://10.0.2.2:3333/api/v0.0.5/chits/' +
                  item.chit_id +
                  '/photo',
              }}>
              <Text
                style={styles.chitContent}
                accessible={true}
                accessibilityRole="text">
                <Text accessible={true} accessibilityRole="text">
                  {item.chit_content}
                  {'\n'}
                  {'\n'}
                </Text>
                {'\n'}
                {item.location == undefined ? (
                  (item.location = ' ')
                ) : (
                  <Text
                    style={styles.timestamp}
                    accessible={true}
                    accessibilityRole="text">
                    {'Location: ' +
                      item.location.latitude +
                      ', ' +
                      item.location.longitude}
                  </Text>
                )}
              </Text>
              {/* {this.renderImage(item.chit_id)} */}
            </Card>
          )}
        />
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  avatarContainer: {
    marginRight: 10,
    marginBottom: 15,
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  timestampContainer: {flexGrow: 1},
  timestamp: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 7,
  },
  chitContainer: {
    margin: 1,
    padding: 20,
    borderRadius: 3,
    borderColor: '#3a444d',
    borderWidth: 2,
    backgroundColor: '#1b2734',
    elevation: 2,
  },
  phContainer: {
    backgroundColor: '#1b2734',
    height: -1,
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
  chitImage: {
    width: 320,
    height: 240,
  },
});

export default Home;

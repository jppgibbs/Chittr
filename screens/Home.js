import React, {Component} from 'react';

import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

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
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=20')
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
            <TouchableHighlight
              onPress={() =>
                // When pressed open chit window
                navigate('ChitScreen', {
                  user_id: item.user.user_id,
                  chit_id: item.chit_id,
                  chit_content: item.chit_content,
                  longitude: item.location.longitude,
                  latitude: item.location.latitude,
                })
              }>
              <Text style={styles.chitContent}>
                <Text style={styles.chitName}>
                  {item.user.given_name} {item.user.family_name}
                  {'\n'}
                  {'\n'}
                </Text>
                <Text>
                  {item.chit_content}
                  {'\n'}
                  {'\n'}
                </Text>
                <Text style={styles.timestamp}>
                  Sent on {new Date(item.timestamp).toLocaleString()}
                </Text>
              </Text>
            </TouchableHighlight>
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
  chitContent: {
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
  chitMargin: {
    margin: 1,
    padding: 20,
  },
  chitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GetChits;

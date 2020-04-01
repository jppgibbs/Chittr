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
      draftList: [],
      user_id: '',
      x_auth: '',
      chit_content: '',
    };
  }
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
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    // Refresh chits when tab is navigated to
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
      this.retrieveAsync();
    });
    this.getData();
    this.retrieveAsync();
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

  // Draw UI
  render() {
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
            <Card containerStyle={styles.chitContainer}>
              <Text style={styles.chitContent}>
                <Text>
                  {item.chit_content}
                  {'\n'}
                </Text>
                {'\n'}
              </Text>
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

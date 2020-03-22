import React, {Component} from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

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

  handleChitContent = text => {
    this.setState({
      chit_content: text,
    });
  };

  getData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
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

  componentDidMount() {
    this.getData();
  }

  // Draw UI
  render() {
    const {navigate} = this.props.navigation;
    if (this.state.isLoading) {
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
                  userID: item.user.user_id,
                  chitID: item.chit_id,
                  chitContent: item.chit_content,
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

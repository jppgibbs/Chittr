import React, {Component} from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
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
      <View>
        <FlatList
          data={this.state.chitList}
          renderItem={({item}) => <Text>{item.chit_content}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 50,
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfbe4',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  topButton: {
    backgroundColor: '#c7ddf5',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 5,
    borderRadius: 10,
  },
  recentChits: {
    fontWeight: 'bold',
    paddingTop: 20,
    textAlign: 'center',
  },
  chitItem: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e6ffff',
    elevation: 2,
  },
  chitHeader: {
    fontWeight: 'bold',
  },
});

export default GetChits;

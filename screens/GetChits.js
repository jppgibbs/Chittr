import React, {Component} from 'react';
import {FlatList, ActivityIndicator, Text, View} from 'react-native';

class GetChits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, //Use this for User Profile switching from login to profile
      chitList: [],
    };
  }

  render() {
    if (this.state.isLoading) {
      //And this
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

  getData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/chits') //Needs sorting, will not work with 127.0.0.1 address
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          chitList: responseJson,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getData();
  }
}

export default GetChits;

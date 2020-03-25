import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, SearchBar, ListItem} from 'react-native-elements';

class SearchUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      dataList: [],
    };
  }

  //Retrieves ProfileID using AsyncStorage
  storeProfileID = async id => {
    try {
      await AsyncStorage.setItem('view_user_id', JSON.stringify(id));
    } catch (error) {
      console.log(error);
    }
  };

  //Search Function which stays blank if there is no text, or displays and adds results to dataList if there is
  search = text => {
    this.setState({search: text});
    if (text === '') {
      this.setState({
        dataList: [],
      });
    } else {
      return fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + text)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            dataList: responseJson,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  //Navigate to single profile function
  viewProfile = id => {
    this.storeProfileID(id);
    this.props.navigation.navigate('Viewing Profile');
  };

  render() {
    return (
      <View style={styles.mainView}>
        <TextInput
          style={styles.textEntry}
          onChangeText={this.search}
          value={this.state.email}
          placeholderTextColor="#918f8a"
          placeholder="Search for a user"
          textContentType="givenName"
          accessibilityComponentType="none"
          accessibilityRole="search"
          accessibilityLabel="Search user"
          accessibilityHint="Enter the user you want to search for"
        />
        <FlatList
          style={styles.list}
          data={this.state.dataList}
          renderItem={({item}) => (
            <ListItem
              containerStyle={styles.listItem}
              title={item.given_name + ' ' + item.family_name}
              subtitle={item.email}
              titleStyle={{color: 'white', fontWeight: 'bold'}}
              subtitleStyle={{color: 'white'}}
              onPress={() => this.viewProfile(item.user_id)}
            />
          )}
          keyExtractor={(item, index) => String(index)}
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
  textEntry: {
    alignItems: 'center',
    padding: 5,
    color: '#ffffff',
    marginTop: 5,
    marginBottom: 0,
    borderColor: '#2296f3',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: '#273341',
    elevation: 3,
    marginHorizontal: 15,
  },
  list: {
    padding: 10,
    borderRadius: 3,
    borderColor: '#3a444d',
    backgroundColor: '#17202b',
    elevation: 2,
    marginTop: 10,
    marginHorizontal: 15,
  },
  listItem: {
    margin: 1,
    padding: 20,
    borderRadius: 3,
    borderColor: '#3a444d',
    borderWidth: 2,
    backgroundColor: '#1b2734',
    elevation: 2,
    color: '#ffffff',
    marginHorizontal: 15,
  },

  userMargin: {
    margin: 1,
    padding: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchUserScreen;

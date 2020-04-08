import React, {Component} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ListItem, SearchBar} from 'react-native-elements';

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      dataList: [],
    };
  }

  /*
## Search User Screen
- This screen allows the user to search all accounts stored in the database
- When a user in the search results is selected, their profile page will be navigated to.
*/

  componentDidMount() {
    this.searchUser('');
  }

  // Query the server with whatever is in the search box currently
  searchUser = async searchInput => {
    this.setState({search: searchInput});
    if (searchInput === '') {
      const response = await fetch(
        // If nothing is in the search bar then show a list of all users
        'http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + '@',
      );
      this.setState({
        dataList: await response.json(),
      });
    } else {
      try {
        const response = await fetch(
          'http://10.0.2.2:3333/api/v0.0.5/search_user?q=' + searchInput,
        );
        this.setState({
          dataList: await response.json(),
        });
      } catch (error) {
        console.log('(Search) Error searching users' + error);
      }
    }
  };

  // Stores the selected user id in async storage and loads the corresponding profile
  goToProfile = async view_user_id => {
    try {
      await AsyncStorage.setItem('view_user_id', JSON.stringify(view_user_id));
      this.props.navigation.navigate('Viewing Profile');
    } catch (error) {
      console.log('(Search) Navigating to user profile' + error);
    }
  };

  render() {
    return (
      <View style={styles.mainView}>
        <SearchBar
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.textEntry}
          style={styles.textEntry}
          value={this.state.search}
          onChangeText={this.searchUser}
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
          keyExtractor={({user_id}) => user_id.toString()}
          renderItem={({item}) => (
            <ListItem
              containerStyle={styles.listItem}
              title={item.given_name + ' ' + item.family_name}
              subtitle={item.email}
              titleStyle={styles.listItemTitle}
              subtitleStyle={styles.listItemSubtitle}
              leftAvatar={{
                source: {
                  uri:
                    'http://10.0.2.2:3333/api/v0.0.5/user/' +
                    item.user_id +
                    '/photo?timestamp=' +
                    Date.now(),
                },
              }}
              bottomDivider
              chevron={{color: 'white'}}
              onPress={() => this.goToProfile(item.user_id)}
            />
          )}
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
  searchBarContainer: {
    backgroundColor: '#17202b',
    borderWidth: 0,
  },
  listItemTitle: {color: 'white', fontWeight: 'bold'},
  listItemSubtitle: {color: 'white'},
  textEntry: {
    alignItems: 'center',
    backgroundColor: '#273341',
    marginHorizontal: 15,
  },
  list: {
    padding: 10,
    backgroundColor: '#17202b',
    marginTop: 10,
    marginHorizontal: 10,
  },
  listItem: {
    backgroundColor: '#1b2734',
    marginHorizontal: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchUser;

import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import {ListItem, Button, Overlay} from 'react-native-elements';

class viewOtherProfile extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      given_name: '',
      family_name: '',
      user_id: '',
      view_user_id: '',
      x_auth: '',
      profileData: [],
      followerList: [],
      followingList: [],
      modalVisible: false,
      modalVisible2: false,
      following: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAccount();
    });
    this.retrieveAccount();
  }
  async retrieveAccount() {
    try {
      // Get the user id that was selected from async
      const view_user_id = await AsyncStorage.getItem('view_user_id');
      const user_id = await AsyncStorage.getItem('user_id');
      const x_auth = await AsyncStorage.getItem('x_auth');
      // Parse into JSON
      const view_user_id_json = await JSON.parse(view_user_id);
      const user_id_json = await JSON.parse(user_id);
      const x_auth_json = await JSON.parse(x_auth);
      this.setState({
        view_user_id: view_user_id_json,
        x_auth: x_auth_json,
        user_id: user_id_json,
      });
      console.log(
        'Debug: View Other Account Loaded with uid: ' + this.state.view_user_id,
      );
      this.getProfileData();
      this.getFollowers(() => {
        console.log(this.state.followerList);
      });
      this.getFollowing(() => {
        console.log(this.state.followingList);
      });
    } catch (e) {
      console.error(e);
    }
  }
  getProfileData() {
    return fetch(
      'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.view_user_id,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            profileData: responseJson,
          },
          () => {
            console.log('Debug: Account retrieved profile async');
          },
        );
      })
      .catch(error => {
        console.log(error);
      });
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

  // ##################################
  // Follower Handling
  // ##################################

  // Follow this user
  async follow() {
    console.log('Attempting to follow user...');
    const view_user_id = this.state.view_user_id;
    try {
      const response = await fetch(
        'http://10.0.2.2:3333/api/v0.0.5/user/' + view_user_id + '/follow',
        {
          method: 'POST',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': JSON.parse(this.state.x_auth),
          },
        },
      );
      console.log('DEBUG: ' + response.status);
      if (response.status == '200') {
        Alert.alert('Follow Succesful', 'You are now following this user');
      } else if (response.status == '401') {
        Alert.alert('Follow Failed', 'Are you logged in?');
      } else if (response.status == '400') {
        Alert.alert('Follow Failed', 'Already following');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Unfollow this user
  async unfollow() {
    const view_user_id = this.state.view_user_id;
    console.log('Unfollowed user');
    try {
      const response = await fetch(
        'http://10.0.2.2:3333/api/v0.0.5/user/' + view_user_id + '/follow',
        {
          method: 'DELETE',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': JSON.parse(this.state.x_auth),
          },
        },
      );
      if (response.status == '200') {
        Alert.alert(
          'Unfollow Succesful',
          'You have stopped following this user',
        );
      } else if (response.status == '401') {
        Alert.alert('Unfollow Failed', 'Are you logged in?');
      } else if (response.status == '404') {
        Alert.alert('Unfollow Failed', 'User not found');
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Get Followers
  async getFollowers() {
    let view_user_id = JSON.parse(await AsyncStorage.getItem('view_user_id'));
    try {
      const response = await fetch(
        'http://10.0.2.2:3333/api/v0.0.5/user/' + view_user_id + '/followers',
      );
      const responseJson = await response.json();
      this.setState({
        followerList: responseJson,
      });
    } catch (error) {
      console.log('Could not retrieve followers: ' + error);
    }
  }

  // Get Following
  async getFollowing() {
    let view_user_id = JSON.parse(await AsyncStorage.getItem('view_user_id'));
    try {
      const response = await fetch(
        'http://10.0.2.2:3333/api/v0.0.5/user/' + view_user_id + '/following',
      );
      const responseJson = await response.json();
      this.setState({
        followingList: responseJson,
      });
    } catch (error) {
      console.log('Could not retrieve following: ' + error);
    }
  }

  // Followers Overlay
  setFollowersVisible(visible) {
    this.setState({modalVisible: visible});
  }
  // Following Overlay
  setFollowingVisible(visible) {
    this.setState({modalVisible2: visible});
  }

  render() {
    console.log('Debug: Profile loaded for user');
    return (
      <View style={styles.AccountControls}>
        <Image
          source={{
            uri:
              'http://10.0.2.2:3333/api/v0.0.5/user/' +
              this.state.profileData.user_id +
              '/photo?timestamp=' +
              Date.now(),
          }}
          style={styles.profilePic}
        />
        <Text style={styles.nameText}>
          {this.state.profileData.given_name}{' '}
          {this.state.profileData.family_name}
        </Text>
        <Text style={styles.detailText}>{this.state.profileData.email}</Text>
        <Text style={styles.detailText}>
          Account ID: {this.state.profileData.user_id}
        </Text>
        <TouchableOpacity onPress={() => this.follow()} style={styles.button}>
          <Text style={styles.bodyText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.unfollow()} style={styles.button}>
          <Text style={styles.bodyText}>Unfollow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setFollowersVisible()}
          style={styles.button}>
          <Text style={styles.bodyText}>View Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setFollowingVisible()}
          style={styles.button}>
          <Text style={styles.bodyText}>View Following</Text>
        </TouchableOpacity>
        <Overlay
          //animationType="slide"
          // visible={this.state.modalVisible}
          testID={'modal'}
          isVisible={this.state.modalVisible}
          backdropColor="#B4B3DB"
          backdropOpacity={0.8}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Followers</Text>
            <FlatList
              data={this.state.followerList}
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
                />
              )}
            />

            <Button
              testID={'close-button'}
              onPress={() => {
                this.setFollowersVisible(!this.state.modalVisible);
              }}
              title="Close"
            />
          </View>
        </Overlay>
        <Modal
          //animationType="slide"
          visible={this.state.modalVisible2}
          testID={'modal'}
          //isVisible={this.isVisible()}
          backdropColor="#B4B3DB"
          backdropOpacity={0.8}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Following</Text>
            <FlatList
              data={this.state.followingList}
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
                />
              )}
            />
            <Button
              testID={'close-button'}
              onPress={() => {
                this.setFollowingVisible(!this.state.modalVisible2);
              }}
              title="Close"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  AccountControls: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  listItemTitle: {color: 'white', fontWeight: 'bold'},
  listItemSubtitle: {color: 'white'},
  button: {
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    marginTop: 5,
    marginBottom: 0,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: '#2296f3',
    marginLeft: 15,
    marginRight: 15,
  },
  profilePic: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
  bodyText: {
    color: '#ffffff',
    marginLeft: 15,
    marginRight: 15,
  },
  nameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 32,
    alignSelf: 'center',
  },
  detailText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: '#006494',
    padding: 22,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 12,
  },
  list: {
    padding: 10,
    borderRadius: 3,
    borderColor: '#3a444d',
    backgroundColor: '#17202b',
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  listItem: {
    margin: 1,
    borderRadius: 3,
    borderColor: '#3a444d',
    borderWidth: 2,
    backgroundColor: '#1b2734',
    elevation: 2,
  },
});

export default viewOtherProfile;

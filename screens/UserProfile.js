import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ListItem, Button, Overlay, Avatar} from 'react-native-elements';

/*
## Account Screen
- If the user is not logged in this screen displays buttons to navigate to the create
account and login screens.
- If the user is logged in, this screen displays the user's information and profile picture,
along with the ability view their followers, who they're following to edit their details, edit
their profile picture (icon button) or logout.
*/

class Account extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      x_auth: '',
      profileData: [],
      followerList: [],
      followingList: [],
      followerOverlayVisible: false,
      followingOverlayVisible: false,
    };
  }

  // ##################
  //    Load Account
  // ##################

  // Get account info from async on first load and every subsequent navigation
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAsync();
    });
    this.retrieveAsync();
  }

  // Retrieve account data from Async storage
  async retrieveAsync() {
    try {
      // Retreieve from Async Storage
      let user_id = await AsyncStorage.getItem('user_id');
      let x_auth = await AsyncStorage.getItem('x_auth');

      // Parse into JSON
      let user_id_json = await JSON.parse(user_id);
      let x_auth_json = await JSON.parse(x_auth);
      this.setState({
        x_auth: x_auth_json,
        user_id: user_id_json,
      });
      console.log(
        '(UserProfile): Loaded with uid: ' +
          this.state.user_id +
          ' auth key: ' +
          this.state.x_auth,
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

  // Get Followers
  async getFollowers() {
    let user_id = JSON.parse(await AsyncStorage.getItem('user_id'));
    try {
      const response = await fetch(
        'http://10.0.2.2:3333/api/v0.0.5/user/' + user_id + '/followers',
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
    let user_id = JSON.parse(await AsyncStorage.getItem('user_id'));
    try {
      const response = await fetch(
        'http://10.0.2.2:3333/api/v0.0.5/user/' + user_id + '/following',
      );
      const responseJson = await response.json();
      this.setState({
        followingList: responseJson,
      });
    } catch (error) {
      console.log('Could not retrieve following: ' + error);
    }
  }

  // Get account data from the server
  getProfileData() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            profileData: responseJson,
          },
          () => {
            console.log('(UserProfile): Account retrieved profile async');
          },
        );
      })
      .catch(error => {
        console.log(error);
      });
  }
  // ############
  //    Logout
  // ############

  // Clear login data and token from the async storage
  async clearAccount() {
    try {
      await AsyncStorage.removeItem('x_auth');
      await AsyncStorage.removeItem('user_id');
      console.log('Cleared account information from async');
      this.retrieveAsync();
    } catch (error) {
      console.log('Removing auth key failed: ' + error);
    }
  }

  // Send logout request to the server
  Logout = () => {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/logout', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'X-Authorization': this.state.x_auth,
        'Content-Type': 'application/json',
      },
    })
      .then(respnoseJson => {
        this.clearAccount();
        Alert.alert('Logout', 'Successfully Logged Out');
        this.props.navigation.navigate('Account');
      })
      .catch(error => {
        Alert.alert('Logout', 'Logout Failed');
        console.log('Logout from server failed: ' + error);
      });
  };

  // #######################################
  //              Interface
  // #######################################

  // Followers Overlay
  setFollowersVisible(visible) {
    this.setState({followerOverlayVisible: visible});
  }
  // Following Overlay
  setFollowingVisible(visible) {
    this.setState({followingOverlayVisible: visible});
  }

  render() {
    if (this.state.user_id !== null) {
      // IF LOGGED IN
      console.log('(UserProfile): Profile loaded as logged in');
      return (
        <View style={styles.primaryView}>
          <Avatar
            rounded
            size="xlarge"
            source={{
              uri:
                'http://10.0.2.2:3333/api/v0.0.5/user/' +
                this.state.user_id +
                '/photo?timestamp=' +
                Date.now(),
            }}
            containerStyle={styles.profilePic}
            showEditButton
            onEditPress={() =>
              this.props.navigation.navigate('Change Profile Pic')
            }
          />
          <Text style={styles.nameText}>
            {this.state.profileData.given_name}{' '}
            {this.state.profileData.family_name}
          </Text>
          <Text style={styles.detailText}>{this.state.profileData.email}</Text>
          <Text style={styles.detailText}>
            Account ID: {this.state.profileData.user_id}
          </Text>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.bodyText}>Navigate your account settings:</Text>
          <View style={styles.buttonGridContainer}>
            <Button
              title="Followers"
              onPress={() =>
                this.setFollowersVisible(!this.state.followerOverlayVisible)
              }
              buttonStyle={styles.buttonSquare}
              icon={
                <Icon
                  name="users"
                  size={15}
                  color="white"
                  style={styles.buttonIcon}
                />
              }
            />
            <Button
              title="Following"
              onPress={() =>
                this.setFollowingVisible(!this.state.followingOverlayVisible)
              }
              buttonStyle={styles.buttonSquare}
              icon={
                <Icon
                  name="user-friends"
                  size={15}
                  color="white"
                  style={styles.buttonIcon}
                />
              }
            />
            <Button
              title="Edit Profile"
              onPress={() => this.props.navigation.navigate('Edit Profile')}
              buttonStyle={styles.buttonSquare}
              icon={
                <Icon
                  name="user-edit"
                  size={15}
                  color="white"
                  style={styles.buttonIcon}
                />
              }
            />
            <Button
              title="Logout"
              onPress={() => this.logout()}
              buttonStyle={styles.buttonSquare}
              icon={
                <Icon
                  name="sign-out-alt"
                  size={15}
                  color="white"
                  style={styles.buttonIcon}
                />
              }
            />
          </View>

          <Overlay
            animationType="slide"
            testID={'modal'}
            isVisible={this.state.followerOverlayVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            overlayStyle={styles.modalContent}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            onBackdropPress={() =>
              this.setFollowersVisible(!this.state.followerOverlayVisible)
            }
            children={
              <View>
                <FlatList
                  style={styles.list}
                  ListHeaderComponent={
                    <Text style={styles.title}>
                      <Icon
                        name="users"
                        size={15}
                        color="white"
                        style={styles.buttonIcon}
                      />
                      &nbsp; Followers
                    </Text>
                  }
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
                      chevron={{color: 'white'}}
                    />
                  )}
                />
              </View>
            }
          />
          <Overlay
            animationType="slide"
            testID={'modal'}
            isVisible={this.state.followingOverlayVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            overlayStyle={styles.modalContent}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            onBackdropPress={() =>
              this.setFollowingVisible(!this.state.followingOverlayVisible)
            }
            children={
              <View>
                <FlatList
                  ListHeaderComponent={
                    <Text style={styles.title}>
                      <Icon
                        name="user-friends"
                        size={15}
                        color="white"
                        style={styles.buttonIcon}
                      />
                      &nbsp; Following
                    </Text>
                  }
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
              </View>
            }
          />
        </View>
      );
    } else {
      // IF LOGGED OUT
      console.log('(UserProfile): Profile loaded as logged out');
      return (
        <View style={styles.primaryView}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}
            style={styles.buttonSquare}>
            <Text style={styles.bodyText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            style={styles.buttonSquare}>
            <Text style={styles.bodyText}>Log In</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

// Stylesheet
const styles = StyleSheet.create({
  primaryView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#17202b',
    color: '#ffffff',
  },
  buttonGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 25,
  },
  buttonSquare: {
    height: 100,
    width: 150,
    alignItems: 'center',
    elevation: 2,
    padding: 10,
    borderColor: '#101010',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: '#2296f3',
    marginVertical: 3,
    marginHorizontal: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
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
    marginHorizontal: '30%',
    marginBottom: 15,
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
    marginHorizontal: '30%',
  },
  detailText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: '32%',
  },
  listItemTitle: {color: 'white', fontWeight: 'bold'},
  listItemSubtitle: {color: 'white'},
  modalContent: {
    backgroundColor: '#17202b',
    justifyContent: 'center',
  },
  modalContentTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 12,
  },
  list: {
    marginVertical: 5,
  },
  listItem: {
    backgroundColor: '#1b2734',
    marginHorizontal: 5,
  },
});

export default Account;

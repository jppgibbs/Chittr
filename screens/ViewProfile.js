import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ListItem, Button, Overlay, Card} from 'react-native-elements';

/*
## View Profile Screen
- This screen displays another user's profile details
- The buttons on this page offer the ability to view recent chits, follow, unfollow,
view their followers and who they're following
*/

class ViewProfile extends Component {
  // Construct variables with default empty values
  constructor(props) {
    super(props);
    this.state = {
      profileData: [],
      followerList: [],
      followingList: [],
      chitList: [],
      followerOverlayVisible: false,
      followingOverlayVisible: false,
      recentChitsOverlayVisible: false,
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

  getMostRecentChit() {
    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.user_id)
      .then(response => response.json())
      .then(responseJson => {
        let chit_id = responseJson.recent_chits[0].chit_id;
        this.setState({
          chit_id: chit_id,
          chitList: responseJson,
        });
      })
      .catch(error => {
        console.log(error);
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
  setRecentChitsVisible(visible) {
    this.setState({recentChitsOverlayVisible: visible});
  }
  // Followers Overlay
  setFollowersVisible(visible) {
    this.setState({followerOverlayVisible: visible});
  }
  // Following Overlay
  setFollowingVisible(visible) {
    this.setState({followingOverlayVisible: visible});
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
        <View style={styles.buttonGridContainer}>
          <Button
            title="Recent Chits"
            onPress={() =>
              this.setRecentChitsVisible(!this.state.recentChitsOverlayVisible)
            }
            buttonStyle={styles.button_o}
            icon={
              <Icon
                name="clock"
                size={15}
                color="white"
                style={styles.buttonIcon}
              />
            }
          />
          <Button
            title="Follow"
            onPress={() => this.follow()}
            buttonStyle={styles.buttonSquare}
            icon={
              <Icon
                name="user-plus"
                size={15}
                color="white"
                style={styles.buttonIcon}
              />
            }
          />
          <Button
            title="Unfollow"
            onPress={() => this.unfollow()}
            buttonStyle={styles.buttonSquare}
            icon={
              <Icon
                name="user-minus"
                size={15}
                color="white"
                style={styles.buttonIcon}
              />
            }
          />
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
        </View>
        <Overlay
          animationType="slide"
          testID={'modal'}
          isVisible={this.state.recentChitsOverlayVisible}
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
            this.setRecentChitsVisible(!this.state.recentChitsOverlayVisible)
          }
          children={
            <View>
              <FlatList
                ListHeaderComponent={
                  <Text style={styles.title}>
                    <Icon
                      name="clock"
                      size={15}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    &nbsp; Recent Chits
                  </Text>
                }
                data={this.state.profileData.recent_chits}
                keyExtractor={({chit_id}) => chit_id.toString()}
                renderItem={({item}) => (
                  <Card
                    // Create chit cards to store chit content
                    accessible={true}
                    containerStyle={styles.chitContainer}
                    titleStyle={styles.title}
                    imageProps={{
                      resizeMode: 'cover',
                      placeholderStyle: styles.chitHideImage,
                      PlaceholderContent: (
                        <View>
                          <ActivityIndicator />
                        </View>
                      ),
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
                      <Text
                        style={styles.timestamp}
                        accessible={true}
                        accessibilityRole="text">
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                      {'\n'}
                      {item.location == undefined ? (
                        (item.location = 'No Location Provided')
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
          }
        />

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
    marginVertical: 3,
    marginHorizontal: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  profilePic: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button_o: {
    alignItems: 'center',
    width: 306,
    marginVertical: 3,
    marginHorizontal: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 15,
    marginRight: 15,
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
  chitContent: {
    fontSize: 14,
    color: '#ffffff',
  },
  chitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewProfile;

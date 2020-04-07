import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import each of the screens used in navigation
import Home from './screens/Home.js';
import PostChits from './screens/PostChits.js';
import Login from './screens/Login.js';
import Register from './screens/Register.js';
import Profile from './screens/UserProfile.js';
import EditProfile from './screens/EditProfile.js';
import Camera from './screens/Camera.js';
import SearchUserScreen from './screens/SearchUser.js';
import ViewOtherProfile from './screens/ViewProfile.js';
import ChangeProfilePic from './screens/EditProfilePic.js';
import Drafts from './screens/Drafts.js';

/*
## App.js
- This file is responsible for the initialization of all of the navigations,
their styles, and how they are nested inside each other.
*/

// Define both of our navigation styles
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

// Create a tab navigator for each of the 4 primary tabs
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        activeColor="#f0edf6"
        barStyle={styles.tabBar}
        tabBarOptions={{
          activeBackgroundColor: '#101922',
          style: {backgroundColor: '#182633'},
          labelStyle: {color: 'white'},
        }}
        screenOptions={{gestureEnabled: true, gestureDirection: 'horizontal'}}>
        <Tab.Screen
          name="Home"
          component={Main}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Post"
          component={Post}
          options={{
            tabBarLabel: 'Post',
            tabBarIcon: ({color}) => (
              <Icon name="feather" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({color}) => (
              <Icon name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({color}) => (
              <Icon name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Home stack navigation nested inside tab navigation (For expandability)
function Main() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="float"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

// Post stack navigation nested inside tab navigation
function Post() {
  return (
    <Stack.Navigator
      initialRouteName="Post"
      headerMode="float"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="New Chit" component={PostChits} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="My Drafts" component={Drafts} />
    </Stack.Navigator>
  );
}

// Search stack navigation nested inside tab navigation
function Search() {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      headerMode="float"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Search Users" component={SearchUserScreen} />
      <Stack.Screen name="Viewing Profile" component={ViewOtherProfile} />
    </Stack.Navigator>
  );
}

// Account stack navigation nested inside tab navigation
function Account() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      headerMode="float"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Account" component={Profile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="Change Profile Pic" component={ChangeProfilePic} />
    </Stack.Navigator>
  );
}

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
// Stylesheet
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#182633',
  },
});

export default App;

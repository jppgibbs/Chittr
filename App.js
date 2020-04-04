import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

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
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a tab navigator for each of the 4 primary tabs
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeBackgroundColor: '#101922',
          style: {backgroundColor: '#182633'},
          labelStyle: {color: 'white'},
        }}
        screenOptions={{}}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Post" component={Post} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Post stack navigation nested inside tab navigation
function Post() {
  return (
    <Stack.Navigator
      initialRouteName="Post"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
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
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
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
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
      }}>
      <Stack.Screen name="Account" component={Profile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="Change Profile Pic" component={ChangeProfilePic} />
    </Stack.Navigator>
  );
}

export default App;

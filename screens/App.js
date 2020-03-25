import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './screens/Login.js';
import Register from './screens/Register.js';

import Home from './screens/Home.js';
import PostChits from './screens/PostChits.js';
import Profile from './screens/UserProfile.js';
import ViewProfile from './screens/ViewProfile.js';
import EditProfile from './screens/EditProfile.js';

import Camera from './screens/Camera.js';

import SearchUserScreen from './screens/SearchUser.js';
import OtherUserProfile from './screens/otherUserProfile.js';
import Followers from './screens/Followers.js';
import Following from './screens/Following.js';
//import Account from './screens/Account.js';

//const Tab = createBottomTabNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

function Account() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerTitleStyle: {color: 'white'},
        headerStyle: {backgroundColor: '#182633'},
      }}>
      <Stack.Screen name="Account" component={Profile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="View Profile" component={ViewProfile} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
    </Stack.Navigator>
  );
}

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
    </Stack.Navigator>
  );
}

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
      <Stack.Screen name="Viewing Profile" component={OtherUserProfile} />
      <Stack.Screen name="View Followers" component={Followers} />
      <Stack.Screen name="View Following" component={Following} />
    </Stack.Navigator>
  );
}

export default App;

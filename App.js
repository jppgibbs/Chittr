import * as React from 'react';
import {Text, View, ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './screens/Login.js';
import Register from './screens/Register.js';

import Home from './screens/Home.js';
import PostChits from './screens/PostChits.js';
import Profile from './screens/UserProfile.js';

import SearchUsers from './screens/SearchUsers.js';

import Camera from './screens/Camera.js';
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
        <Tab.Screen name="Post" component={PostChits} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Register" component={Register} />
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
      <Stack.Screen name="My Profile" component={Profile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

export default App;

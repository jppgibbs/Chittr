import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Login from './screens/Login.js';
import Register from './screens/Register.js';

import Home from './screens/Home.js';
import PostChits from './screens/PostChits.js';

import SearchUsers from './screens/SearchUsers.js';

import Camera from './screens/Camera.js';
import UserProfile from './screens/UserProfile.js';

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
  },
  Post: {
    screen: PostChits,
  },
  // Search: {
  //   screen: SearchUsers,
  // },
  // Camera: {
  //   screen: Camera,
  // },
  Login: {
    screen: Login,
  },
  Register: {
    screen: Register,
  },
  Account: {
    screen: UserProfile,
  },
});

const AppContainer = createAppContainer(TabNavigator);

export default AppContainer;

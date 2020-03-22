import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Login from './screens/Login.js';
import CreateAccount from './screens/CreateAccount.js';

import GetChits from './screens/GetChits.js';
import PostChits from './screens/PostChits.js';

import SearchUsers from './screens/SearchUsers.js';

import Camera from './screens/Camera.js';

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: GetChits,
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
    screen: CreateAccount,
  },
});

const AppContainer = createAppContainer(TabNavigator);

export default AppContainer;

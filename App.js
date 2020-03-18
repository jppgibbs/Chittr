import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import GetChits from './screens/GetChits.js';
import PostChits from './screens/PostChits.js';
import SearchUsers from './screens/SearchUsers.js';
import UserProfile from './screens/UserProfile.js';
import Camera from './screens/Camera.js';

const AppTabNav = createBottomTabNavigator({
  Home: {
    screen: GetChits,
  },
  Post: {
    screen: PostChits,
  },
  Search: {
    screen: SearchUsers,
  },
  Camera: {
    screen: Camera,
  },
  Profile: {
    screen: UserProfile,
  },
});

const AppContainer = createAppContainer(AppTabNav);

export default AppContainer;

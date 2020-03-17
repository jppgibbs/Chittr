import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from './Tabs/HomeScreen'
import Login from './Tabs/LoginPortal'
const NavigationPortal = createBottomTabNavigator({
    Home: {
        screen: Home
    },
    Login: {
        screen: Login
    }
});

const Container = createAppContainer(NavigationPortal)

export default Container;
import React, { Component } from 'react';
import { Text, View } from 'react-native';

class HomeScreen extends Component {

    static navigationOptions = {
        header: null

    }

    render() {
        return ( 
		<View>
			<Text > Home Screen </Text> 
		</View>
        );
    }

}
export default HomeScreen
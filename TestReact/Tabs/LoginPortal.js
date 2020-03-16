import React, { Component } from 'react';
import { Text, TextInput, Button, View, Alert } from 'react-native';

class Login extends Component {
	constructor(props){
		super(props);
		this.state={
			email: '',
			password: ''
		};
	}
	
 
	login = () => {
		let res = JSON.stringify ({
			email: this.state.email,
			password: this.state.password
		});
		console.log(res);
		return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
		{
			method:'POST',
			body: res,
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then((response) => {
			console.log(response.status);
			let res = response.json();
			// console.log(res.status);
			return res;
		})
		.then((responseJson) => {
			console.log(responseJson.token);
		})
		.catch((error) => {
			console.error(error);
		});
	}
 
 render(){
	 return (
		<View>
			<Text >Login Screen </Text> 
			
			<Text>Email</Text>
			<TextInput
				value={this.state.email}
				onChangeText={(email) => this.setState({email})}
				type="emailAddress"
			/>
			<Text>Password</Text>
			<TextInput
				value={this.state.password}
				onChangeText={(text) => this.setState({"password": text})}
				secureTextEntry
			/>
			<Button
				title="Login"
				onPress={this.login}
			/>
		</View>
	 );
 }
}

export default Login;
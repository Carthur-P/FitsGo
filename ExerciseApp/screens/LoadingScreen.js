import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

export default class LoadingScreen extends Component {

    componentDidMount(){
        this.checkIfLoggedIn();
        this.props.navigation.addListener('didFocus', () => {
            this.checkIfLoggedIn();
        });
    }

    checkIfLoggedIn() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                var newUser = this.props.navigation.getParam('newUser', false)
                console.log(newUser);
                if(newUser){
                    console.log('new user sign in');
                    this.props.navigation.navigate('Profile');
                } else {
                    console.log('sign in');
                    this.props.navigation.navigate('Home');
                }
            } else {
                console.log('not sign in');
                this.props.navigation.navigate('SignIn')
            }
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});



import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Spinner, MyButton, Card, CardSection, Input } from '../components/common';
import { Header } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';
import { db } from '../components/common/config';


export default class MyRecordsScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {

    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user });
            } else {
                this.props.navigation.navigate('SignIn');
            }
        });
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.goBack()} size={32} color="white" />}
                    centerComponent={{ text: "My Records", style: { color: '#FFF', fontSize: 25 } }} />
                <Text> My Records </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})

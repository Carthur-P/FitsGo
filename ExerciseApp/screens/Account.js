import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Header, ThemeProvider } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';
import { MyButton, Card, CardSection, Input } from '../components/common';


export default class Icon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            currentPassword: '',
            password: '',
            password2: '',
            user: '',
            error: '',
        };
    }

    componentWillMount() {
        // check user authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user });
            } else {
                this.props.navigation.navigate('SignIn');
            }
        });

    }

    // Reauthenticates the current user and returns a promise...
    reauthenticate = (currentPassword) => {
        let user = this.state.user;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    onButtonPress() {
        const { currentPassword, password, password2 } = this.state;

        if (currentPassword.trim() == '') {
            this.setState({ error: 'Please type current password' });
            return false;
        }

        if (password.trim() == '') {
            this.setState({ error: 'Please type password' });
            return false;
        }

        if (password2.trim() == '') {
            this.setState({ error: 'Please confirm password' });
            return false;
        }

        if ((password.length < 6)) {
            this.setState({ error: 'Password at least 6 bit' });
            return false;
        }

        if (password.trim() !== password2.trim()) {
            this.setState({ error: 'Two passwords does not match' });
            return false;
        }

        this.setState({ error: '' });

        this.reauthenticate(this.state.currentPassword)
            .then(() => {
                this.state.user.updatePassword(this.state.password2)
                    .then(() => {
                        Alert.alert("Password has been changed. Please Login again...");
                        firebase.auth().signOut();
                        this.props.navigation.navigate('SignIn');
                    })
                    .catch((error) => { console.log(error.message); });
            })
            .catch((error) => { Alert.alert("Current password is invalid"); });
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.goBack()} size={32} color="white" />}
                    centerComponent={{ text: "Update Password", style: { color: '#FFF', fontSize: 25 } }}
                />

                <Card>
                    <CardSection>
                        <Input
                            secureTextEntry
                            placeholder="current password"
                            label="Current Password"
                            value={this.state.currentPassword}
                            onChangeText={currentPassword => this.setState({ currentPassword })}
                        >
                        </Input>
                    </CardSection>
                    <CardSection>
                        <Input
                            secureTextEntry
                            placeholder="new password"
                            label="New Password"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        >
                        </Input>
                    </CardSection>
                    <CardSection>
                        <Input
                            secureTextEntry
                            placeholder="confirm password"
                            label="Confirm New Password"
                            value={this.state.password2}
                            onChangeText={password2 => this.setState({ password2 })}
                        >
                        </Input>
                    </CardSection>
                    {this.state.error ? <Text style={styles.errorTextStyle}>{this.state.error}</Text> : null}
                    <CardSection>
                        <MyButton
                            onPress={() => { this.onButtonPress() }}
                        >Update
                        </MyButton>
                    </CardSection>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorTextStyle: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#f26b6b',
        paddingHorizontal: 30,
        paddingVertical: 5
    },
})

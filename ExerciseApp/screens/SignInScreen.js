import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import { Header } from 'react-native-elements';
import { Spinner, MyButton, Card, CardSection, Input } from '../components/common';
import { YellowBox } from 'react-native';
import * as Google from 'expo-google-app-auth';

YellowBox.ignoreWarnings(['Setting a timer']);

class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            email: '',
            password: '',
            error: '',
        };
    }

    onButtonPress() {
        const { email, password } = this.state;

        if (email.trim() == '') {
            this.setState({ error: 'Please type Email address!' });
            return false;
        }

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) == false) {
            this.setState({ error: 'Email Address invalid!' });
            return false;
        }

        if (password.trim() == '') {
            this.setState({ error: 'Please type Password!' });
            return false;
        }

        if (password.trim().length < 6) {
            this.setState({ error: 'Password at least 6 bit' });
            return false;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(this.onLoginSuccess.bind(this))
        .catch(this.onLoginFail.bind(this));

        this.setState({ error: ''})
    }

    onGoogleSignIn(googleUser) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential)
        .then((result) => { 
            if(result.additionalUserInfo.isNewUser){
                firebase.database().ref('/users/' + result.user.uid).set({
                    firstName: result.additionalUserInfo.profile.given_name,
                    lastName: result.additionalUserInfo.profile.family_name,
                    gender : 'Male',
                    iconUrl: result.additionalUserInfo.profile.picture,
                    weight: 0
                });
                this.props.navigation.navigate('Loading', { newUser: true });
            } 
        })
        .catch((error) => { 
            console.log(error);
            this.onLoginFail();
        });
    }

    async onGoogleButtonPress() {
        try {
            const result = await Google.logInAsync({
                androidClientId: "731302394432-hgo14vo8nj273q763hsoud2g34s37ac1.apps.googleusercontent.com",
                // iosClientId: YOUR_CLIENT_ID_HERE,
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onGoogleSignIn(result);
            } else {
                console.log("The user did not complete google sign in");
            }
        } catch (e) {
            return { error: true };
        }
    }

    isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.user.id) {
              return true;
            }
          }
        }
        return false;
      }

    onLoginFail() {
        this.setState({
            error: 'Authentication Failed.'
        });
        this.props.navigation.navigate('SignUp')
    }

    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            error: '',
        });
        this.props.navigation.navigate('Home');
    }

    renderButton() {
        return (
            <CardSection>
                <MyButton onPress={this.onButtonPress.bind(this)}>Log in</MyButton>
                <MyButton onPress={this.onGoogleButtonPress.bind(this)}>Sign in with Google</MyButton>
            </CardSection>
        );
    }

    render() {
        return (
            <View>
                <Header
                    centerComponent={{ text: "Sign In", style: { color: '#FFF', fontSize: 25 } }} />
                <Card>
                    <CardSection>
                        <Input
                            placeholder="Email address"
                            label="Email"
                            value={this.state.email}
                            onChangeText={email => this.setState({ email })}
                        >
                        </Input>
                    </CardSection>
                    <CardSection>
                        <Input
                            secureTextEntry
                            placeholder="password"
                            label="Password"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        >
                        </Input>
                    </CardSection>
                        {this.state.error ? <Text style={styles.errorTextStyle}>{this.state.error}</Text> : null}
                        {this.renderButton()}
                    <CardSection >
                        <TouchableOpacity style={styles.signUpContainer} onPress={() => this.props.navigation.navigate('SignUp')}>
                            <Text style={{ marginVertical: 15 }}>Don't have an Account?  <Text style={{ color: 'blue' }}>Sign up</Text></Text>
                        </TouchableOpacity>
                    </CardSection>
                    <CardSection >
                        <TouchableOpacity style={styles.signUpContainer} onPress={() => this.props.navigation.navigate('ResetPassword')}>
                            <Text style={{ marginVertical: 15 }}>Forget password?  <Text style={{ color: 'blue' }}>Reset</Text></Text>
                        </TouchableOpacity>
                    </CardSection>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    signUpContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default SignInScreen;
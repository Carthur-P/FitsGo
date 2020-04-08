import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import firebase from 'firebase';
import { db } from '../components/common/config';
import { Header } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { Spinner, MyButton, Card, CardSection, Input } from '../components/common';


class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
            error: '',
            loading: false,
            firstName: '',
            lastName: '',
        };
    }

    onButtonPress() {
        const { firstName, lastName, email, password, password2 } = this.state;

        if (firstName.trim() == '') {
            this.setState({ error: 'Please type First Name!' });
            return false;
        }

        if (lastName.trim() == '') {
            this.setState({ error: 'Please type Last Name!' });
            return false;
        }

        if (email.trim() == '') {
            this.setState({ error: 'Please type Email!' });
            return false;
        }

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) == false) {
            this.setState({ error: 'Email Address invalid!' });
            return false;
        }

        if (password.trim() == '') {
            this.setState({ error: 'Please type Password' });
            return false;
        }

        if (password2.trim() == '') {
            this.setState({ error: 'Please type Password again' });
            return false;
        }

        if ((password.length < 6)) {
            this.setState({ error: 'Password at least 6 bit' });
            return false;
        }

        if (password.trim() !== password2.trim()) {
            this.setState({ error: 'Two Passwords does not match' });
            return false;
        }

        this.setState({ error: '', loading: true });

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(
                () => {
                    this.saveProfile(firstName, lastName, 'Male', '0', '2000-08-08');
                    this.setState({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        password2: '',
                        loading: false,
                        error: '',
                    });
                    this.props.navigation.navigate('Profile');
                }
            )
            .catch(this.onLoginFail.bind(this));
    }

    saveProfile = (firstName, lastName, gender, weight, birthday) => {
        db.ref('/users/' + firebase.auth().currentUser.uid).set({
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            weight: weight,
            birthday, birthday,
            iconUrl: 'https://firebasestorage.googleapis.com/v0/b/bitexercise.appspot.com/o/icons%2Fuser-icon-image-placeholder.jpg?alt=media&token=91d6ca81-42b5-462b-b87a-149343efe460'
        });
        db.ref('/records/' + firebase.auth().currentUser.uid + '/' + new Date().getTime()).set({
            directionMode: '',
            doneTime: '',
            realDuration: '',
            finalDistance: '',
            calories: ''
        });
    }

    onLoginFail() {
        this.setState({
            loading: false,
            error: 'Something went wrong.',
        });
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size="large" />;
        }

        return (
            <MyButton
                onPress={this.onButtonPress.bind(this)}>Sign up
            </MyButton>
        );
    }

    render() {

        return (
            <View>
                <Header
                    // leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.goBack()} size={32} color="white" />}
                    centerComponent={{ text: "Sign Up", style: { color: '#FFF', fontSize: 25 } }} />
                <Card>
                    <CardSection>
                        <Input
                            placeholder="First Name"
                            label="First Name"
                            value={this.state.firstName}
                            onChangeText={firstName => this.setState({ firstName })}
                        ></Input>
                    </CardSection>
                    <CardSection>
                        <Input
                            placeholder="Last Name"
                            label="Last Name"
                            value={this.state.lastName}
                            onChangeText={lastName => this.setState({ lastName })}
                        ></Input>
                    </CardSection>
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
                            placeholder="Password"
                            label="Password"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        >
                        </Input>
                    </CardSection>
                    <CardSection>
                        <Input
                            secureTextEntry
                            placeholder="Type password again"
                            label="Password"
                            value={this.state.password2}
                            onChangeText={password2 => this.setState({ password2 })}
                        >
                        </Input>
                    </CardSection>
                    {this.state.error ? <Text style={styles.errorTextStyle}>{this.state.error}</Text> : null}
                    <CardSection>
                        {this.renderButton()}
                    </CardSection>
                    <CardSection >

                        <TouchableOpacity style={styles.signUpContainer} onPress={() => this.props.navigation.navigate('SignIn')}>
                            <Text style={{ marginVertical: 15 }}>Already have an account?  <Text style={{ color: 'blue' }}>Log in</Text></Text>
                        </TouchableOpacity>


                    </CardSection>

                </Card>
                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('PrivacyPolicy')}>
                        <Text style={{ color: 'blue' }}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

styles = StyleSheet.create({
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
    },
    labelStyle: {
        paddingLeft: 5,
        fontSize: 16,
        flex: 1
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    genderPicker: {
        color: '#000000',
        paddingRight: 5,
        paddingLeft: 5,
        width: 50,
        fontSize: 16,
        height: 40,
        flex: 2,
        fontSize: 16,
    },
    slider: {
        width: 200
    }
});

export default SignUpScreen;
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import { Header } from 'react-native-elements';
import { Spinner, MyButton, Card, CardSection, Input } from '../components/common';
import { YellowBox } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

YellowBox.ignoreWarnings(['Setting a timer']);

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isClicking: false,
        };
    }

    renderButton() {
        if (this.state.isClicking) {
            return <Spinner size="large" />;
        }

        return (
            <MyButton
                onPress={this.onResetPasswordPress}>Reset
            </MyButton>
        );
    }

    onResetPasswordPress = () => {
        const { email } = this.state;

        if (email.trim() == '') {
            this.setState({ error: 'Please type Email address!' });
            return false;
        }

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            this.setState({ error: 'Email Address invalid!' });
            return false;
        }

        this.setState({ error: '', isClicking: true});

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert("Password reset email has been sent.");
                this.props.navigation.navigate('SignIn');
            }, (error) => {
                Alert.alert(error.message);
                this.props.navigation.navigate('SignIn');
            });
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.goBack()} size={32} color="white" />}
                    centerComponent={{ text: "Reset Password", style: { color: '#FFF', fontSize: 25 } }} />
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
                    {this.state.error ? <Text style={styles.errorTextStyle}>{this.state.error}</Text> : null}
                    <CardSection>
                        {this.renderButton()}
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
});

export default ResetPassword;
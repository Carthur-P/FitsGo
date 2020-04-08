import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Slider, Alert } from 'react-native';
import { MyButton, Card, CardSection, Input } from '../components/common';
import { Header } from 'react-native-elements';
import { AntDesign, Foundation, FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase';
import { db } from '../components/common/config';
import Moment from 'moment';
import DateTimePicker from "react-native-modal-datetime-picker";


export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            gender: '',
            maleSelected: false,
            femaleSelected: false,
            weight: 0,
            isDateTimePickerVisible: false,
            birthday: '',
        };
    }

    componentWillMount() {
        currentUser = db.ref('/users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let userObj = snapshot.val();
            if (userObj != null) {
                this.setState({
                    firstName: userObj.firstName,
                    lastName: userObj.lastName,
                    birthday: userObj.birthday,
                    gender: userObj.gender,
                    weight: userObj.weight,
                });
                if (userObj.gender === 'Male') {
                    this.setState({ maleSelected: true });
                } else {
                    this.setState({ femaleSelected: true });
                }
            }
        })
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        let birthday = Moment(date).format('YYYY-MM-DD');
        this.setState({ birthday: birthday });
        this.hideDateTimePicker();
    };

    handSliderChange(value) {
        this.setState(() => {
            return {
                weight: parseFloat(value),
            };
        });
    }

    handleSave() {
        const { firstName, lastName, gender, weight, birthday } = this.state;
        db.ref('/users/' + firebase.auth().currentUser.uid)
        .update({
            firstName,
            lastName,
            gender,
            weight,
            birthday
        })
        .then(() => {
            Alert.alert('Profile has been saved.');
            this.props.navigation.navigate('Home');
        })
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.navigate('Home')} size={32} color="white" />}
                    centerComponent={{ text: "Profile", style: { color: '#FFF', fontSize: 25 } }} />
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
                        <View style={styles.containerStyle}>
                            <Text style={styles.labelStyle}>Gender</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ gender: 'Male', maleSelected: true, femaleSelected: false });
                                }}
                            >
                                <FontAwesome style={styles.genderSpace} name='male' size={35} color={this.state.maleSelected ? '#48cfad' : '#000000'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ gender: 'Female', femaleSelected: true, maleSelected: false });
                                }}
                            >
                                <FontAwesome style={styles.genderSpace} name='female' size={35} color={this.state.femaleSelected ? '#48cfad' : '#000000'} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, flex: 1, textAlign: "right" }}>{this.state.gender}</Text>
                        </View>
                    </CardSection>
                    <CardSection>
                        <View style={styles.containerStyle}>
                            <Text style={styles.labelStyle}>Weight</Text>
                            <Slider
                                style={styles.slider}
                                step={1}
                                minimumValue={10}
                                maximumValue={250}
                                onValueChange={this.handSliderChange.bind(this)}
                                value={parseFloat(this.state.weight)}
                            />
                            <Text style={{ fontSize: 12, flex: 1, textAlign: "right" }}>{String(this.state.weight)}KG</Text>
                        </View>
                    </CardSection>
                    <CardSection>
                        <View style={styles.containerStyle}>
                            <Text style={styles.labelStyle}>Birthday</Text>
                            <Text style={{ fontSize: 16, width: 120, flex: 3, textAlign: 'center' }}>{String(this.state.birthday)}</Text>
                            <Foundation size={37} style={{ flex: 1, textAlign: "right" }} color='#48cfad' name='calendar' onPress={this.showDateTimePicker}></Foundation>
                        </View>
                    </CardSection>
                    <DateTimePicker
                        mode='date'
                        datePickerModeAndroid='spinner'
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                    <CardSection>
                        <MyButton
                            onPress={this.handleSave.bind(this)}>Save
                        </MyButton>
                    </CardSection>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    labelStyle: {
        paddingLeft: 5,
        fontSize: 15,
        flex: 1
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    slider: {
        width: '61%',
    },
    genderSpace: {
        marginLeft: 20,
        marginRight: 20,
        flex: 1
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

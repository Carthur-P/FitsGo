import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView, View, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { db } from './../components/common/config';
import Drawer from 'react-native-drawer'
import Map from '../components/Map';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import * as Permissions from 'expo-permissions';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            data: [],
            sourceImg: 'https://firebasestorage.googleapis.com/v0/b/bitexercise.appspot.com/o/icons%2Fuser-icon-image-placeholder.jpg?alt=media&token=91d6ca81-42b5-462b-b87a-149343efe460',
            permissionGranted: false,
        };
    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    async getUserPermission() {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            //alert('Application will use location services');
            this.setState({ permissionGranted: true });
        } else {
            this.setState({ permissionGranted: false });
        }
    }

    componentWillMount() {
        this.getUserPermission();
        this.props.navigation.addListener('didFocus', () => {
            this.checkIfLoggedIn();
        });
    }

    checkIfLoggedIn() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                // Get user icon url from firebase
                currentUserIcon = db.ref('/users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
                    let userObj = snapshot.val();
                    if (userObj.iconUrl) {
                        this.setState({
                            sourceImg: userObj.iconUrl,
                        });
                    }
                })
                this.setState({user: user});
                this.props.navigation.navigate('Home');
            } else {
                this.props.navigation.navigate('SignIn')
            }
        });
    }

    // check if user default icon does not exists place a holder icon
    render_Icon() {
        return (<Image style={styles.userIconPlaceholder} source={{ uri: this.state.sourceImg }} />)
    }

    render() {
        var drawer = (
            <ScrollView bounces='False' contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: '#1d1d26', justifyContent: 'space-between' }}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={styles.userIconContainer}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Icon')}>
                            {this.render_Icon()}
                        </TouchableOpacity>
                        <Text onPress={() => this.props.navigation.navigate('Account')} style={{ marginVertical: 15, color: '#FFFFFF' }}>{this.state.user ? this.state.user.email : null}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => { this.closeControlPanel(); this.props.navigation.navigate('Home') }}>
                            <View style={styles.item}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="home" size={20} color="green" />
                                </View>
                                <Text style={styles.label}>Home</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <View style={styles.item}>
                                <View style={styles.iconContainer}>
                                    <AntDesign name="profile" size={18} color="pink" />
                                </View>
                                <Text style={styles.label}>Profile</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('MyRecords')}>
                            <View style={styles.item}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="ios-stats" size={20} color="yellow" />
                                </View>
                                <Text style={styles.label}>My Records</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <TouchableOpacity onPress={() => {
                    firebase.auth().signOut()
                    .then(() => { console.log('Signing out'); }
                    ,(error) => { console.log(error) });
                }}>
                    <View style={styles.item}>
                        <View style={styles.iconContainer}>
                            <AntDesign name="logout" size={20} color="red" />
                        </View>
                        <Text style={styles.label}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );

        if (this.state.permissionGranted) {
            return (
                <View style={styles.container}>
                    <Drawer
                        ref={(ref) => this._drawer = ref}
                        content={drawer}
                        openDrawerOffset={(viewport) => viewport.width - 200}
                        tapToClose={true}
                        negotiatePan={false}>
                        <Header
                            leftComponent={<Icon name="menu" onPress={() => this._drawer.open()} />}
                            centerComponent={{ text: "Fits Go!", style: { color: '#FFF', fontSize: 25 } }}
                            rightComponent={<Icon name="home" />} />
                        <Map runningLocations={this.state.data} />
                    </Drawer>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.errorTextStyle}>Please enable location permission in the phone setting to use this application</Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: '#191919'
    },
    userIconPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        margin: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    iconContainer: {
        marginHorizontal: 16,
        width: 24,
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
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
});
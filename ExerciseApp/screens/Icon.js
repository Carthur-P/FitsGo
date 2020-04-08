import React, { Component } from 'react';
import { Image, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';
import 'firebase/storage';
import { db } from '../components/common/config';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';


export default class Icon extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        sourceImg: 'https://firebasestorage.googleapis.com/v0/b/bitexercise.appspot.com/o/icons%2Fuser-icon-image-placeholder.jpg?alt=media&token=91d6ca81-42b5-462b-b87a-149343efe460',
        permissionGranted: false,
    };

    async getUserPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            this.setState({ permissionGranted: true });
        } else {
            this.setState({ permissionGranted: false });
        }
    }

    componentWillMount() {
        this.getUserPermission();

        // check user authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Get user icon url from firebase
                currentUserIcon = db.ref('/users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
                    let userObj = snapshot.val();
                    if (userObj.iconUrl) {
                        this.setState({
                            sourceImg: userObj.iconUrl,
                        });
                    }
                })

                this.setState({ user: user });
            } else {
                this.props.navigation.navigate('SignIn');
            }
        });

    }

    // Get Blob image user local AJAX
    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                // return the blob
                resolve(xhr.response);
            };

            xhr.onerror = function () {
                // something went wrong
                reject(new Error('uriToBlob failed'));
            };

            // this helps us get a blob
            xhr.responseType = 'blob';

            xhr.open('GET', uri, true);
            xhr.send(null);
        });
    }

    // upload image file to fire base storage 
    handleOnPress = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [200, 200],
            quality: 1
        })
            .then((result) => {
                if (!result.cancelled) {
                    const { height, width, type, uri } = result;
                    return this.uriToBlob(uri);
                }
            })
            .then((blob) => {
                // start upload
                var storageRef = firebase.storage().ref();
                var metadata = { contentType: blob.type };
                var uploadTask = storageRef.child(`icons/${firebase.auth().currentUser.uid}.jpg`).put(blob, metadata);

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // switch (snapshot.state) {
                        //     case firebase.storage.TaskState.PAUSED:
                        //         console.log('Upload is paused');
                        //         break;
                        //     case firebase.storage.TaskState.RUNNING:
                        //         console.log('Upload is running');
                        //         break;
                        // }
                    }, (error) => {
                        // switch (error.code) {
                        //     case 'storage/unauthorized':
                        //         // User doesn't have permission to access the object
                        //         break;
                        //     case 'storage/canceled':
                        //         // User canceled the upload
                        //         break;
                        //     case 'storage/unknown':
                        //         // Unknown error occurred, inspect error.serverResponse
                        //         break;
                        // }
                    }, () => {
                        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            db.ref('/users/' + firebase.auth().currentUser.uid)
                                .update({
                                    iconUrl: downloadURL
                                })
                                .then((res) => {
                                    Alert.alert('Icon has been saved.');
                                })
                        });
                    })

            }).catch((error) => {
                console.log(error);
            });
    }

    // check if user default icon does not exists place a holder icon
    render_Icon() {
        // if (this.state.sourceImg === '0') {
        //     return (<Image style={styles.userIcon} source={require('../assets/user-icon-image-placeholder.jpg')} />)
        // } else {
            return (<Image style={styles.userIcon} source={{ uri: this.state.sourceImg }} />)
        // }
    }

    render() {
        return (
            <View>
                <Header
                    leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.goBack()} size={32} color="white" />}
                    centerComponent={{ text: "Edit Icon", style: { color: '#FFF', fontSize: 25 } }}
                />
                <View style={[styles.container]}>
                    <TouchableOpacity
                        onPress={this.handleOnPress}
                    >
                        {this.render_Icon()}
                        <MaterialCommunityIcons style={styles.btn} name='camera' color='#48cfad' size={61}></MaterialCommunityIcons>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        textAlign: 'center',
    },
    userIcon: {
        width: 200,
        height: 200,
        marginTop: 50,
        marginBottom: 20,
        borderRadius: 200 / 2
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

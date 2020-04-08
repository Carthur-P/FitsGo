import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Header } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';
import { db } from '../components/common/config';

export default class MyRecordsScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isThereRecord: false,
        records: [],
        refreshing: false,
    };

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().then(() => {
            this.setState({ refreshing: false });
        });
    }

    fetchData() {
        return new Promise((resolve, reject) => {
            db.ref('records/' + firebase.auth().currentUser.uid).on('value', (data) => {
                if (Object.values(data.val())) {
                    this.setState({
                        isThereRecord: true,
                        records: Object.values(data.val())
                    });
                } else {
                    db.ref('/records/' + firebase.auth().currentUser.uid + '/' + new Date().getTime()).push()
                    this.setState({
                        isThereRecord: false
                    });
                }
            });
            const error = false;
            if (!error) {
                resolve();
            } else {
                reject("Something went wroing");
            }
        });
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user });
            } else {
                this.props.navigation.navigate('SignIn');
            }
        });

        this.fetchData();
    }

    convertMode(directionMode) {
        let result = '';
        switch (directionMode) {
            case 'WALKING':
                result = 'Walk';
                break;
            case 'BICYCLING':
                result = 'Bike';
                break;
            case 'RUNNING':
                result = 'Run';
                break;
        }
        return result;
    }

    renderRecords() {
        return this.state.records.map((record, i) => {
            if (record.doneTime !== '' && record.directionMode !== '') {
                return (
                    <View style={styles.table} key={i}>
                        <Text style={styles.rows}>{record.doneTime}</Text>
                        <Text style={styles.rows}>{this.convertMode(record.directionMode)}</Text>
                        <Text style={styles.rows}>{parseFloat(record.finalDistance).toFixed(3) < 1 ? parseFloat(record.finalDistance * 1000).toFixed(0) + 'm' : parseFloat(record.finalDistance).toFixed(2) + 'km'}</Text>
                        <Text style={styles.rows}>{parseInt(record.realDuration / 1000 / 60)} min</Text>
                        <Text style={styles.rows}>{record.calories} cal</Text>
                        <Text style={styles.rows}>{record.markerBadge}</Text>
                    </View>
                )
            }
        });
    }

    renderEmptyRecords(){
        return (
            <View style={styles.table}>
                <Text style={styles.rows}>-</Text>
                <Text style={styles.rows}>-</Text>
                <Text style={styles.rows}>-</Text>
                <Text style={styles.rows}>-</Text>
                <Text style={styles.rows}>-</Text>
                <Text style={styles.rows}>-</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView>
                <Header
                    leftComponent={<AntDesign name="arrowleft" onPress={() => this.props.navigation.goBack()} size={32} color="white" />}
                    centerComponent={{ text: "My Records", style: { color: '#FFF', fontSize: 25 } }} />
                {/* <Text style={styles.title}> Exercise log </Text> */}
                <View style={styles.tableHead}>
                    <Text style={styles.headRows}>Date</Text>
                    <Text style={styles.headRows}>Mode</Text>
                    <Text style={styles.headRows}>Distance</Text>
                    <Text style={styles.headRows}>Duration</Text>
                    <Text style={styles.headRows}>Calory</Text>
                    <Text style={styles.headRows}>Badge</Text>
                </View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
                style={styles.recordArea}>
                    {this.state.isThereRecord ? this.renderRecords() : this.renderEmptyRecords()}
                </ScrollView>
                {/* <View>
                    <View style={styles.badgeArea}>
                        <Text>Badge Collected</Text>
                    </View>
                </View> */}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#48cfad'
    },
    table: {
        textAlign: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    tableHead: {
        textAlign: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    rows: {
        fontSize: 12,
        backgroundColor: '#7adac4',
        textAlign: 'center',
        marginBottom: 1,
        alignSelf: 'stretch',
        flex: 1,
        height: 37,
        lineHeight: 37,
    },
    headRows: {
        fontSize: 15,
        backgroundColor: '#0ac092',
        textAlign: 'center',
        marginBottom: 1,
        alignSelf: 'stretch',
        flex: 1,
        height: 40,
        lineHeight: 40,
        fontWeight: 'bold',
    },
    badgeArea: {
        flex: 1,
        height: 50,
    }
})

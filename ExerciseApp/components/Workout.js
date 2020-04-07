import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, YellowBox, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TimeFormatter from 'minutes-seconds-milliseconds';

class Workout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runOption: true, // run icon state
            bikeOption: false, // bike icon state
            walkOption: false, // walk icon state
            screenState: 0, // button state [0: default, 1: start workout, 2: pause state]
            timerOn: false, // is count timer
            mainTimer: null, // timer
            startTime: null,
            speed: 0,
            estimateDistance: 0,
            estimateDuration: 0,
            estimateTarget: '',
        };
    }

    startTimer = () => {
        this.setState({
            timerOn: true,
            mainTimer: this.state.mainTimer,
            startTime: Date.now() - this.state.mainTimer,
        });
        this.timer = setInterval(() => {
            this.setState({
                mainTimer: Date.now() - this.state.startTime,
            });
        }, 100);
    };

    pauseTimer = () => {
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        this.setState({ startTime: this.state.mainTimer });
    }

    resumeTimer = () => {
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        this.setState({ startTime: this.state.mainTimer });
        this.startTimer();
    }

    stopTimer = () => {
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        this.setState({ startTime: 0, mainTimer: 0 });
    }

    setDirectionsMode = (m) => {
        this.props.mapDirectionsModeCallback(m);
    }

    calculateSpeed() {
        return parseFloat(this.props.distanceTravelled / (this.state.mainTimer / 1000 / 60 / 60)).toFixed(1);
    }

    calculateDistance() {
        let dis = parseFloat(this.props.distanceTravelled).toFixed(3);
        if (dis < 1) {
            return dis * 1000 + ' m';
        } else {
            return parseFloat(dis).toFixed(2) + ' km';
        }
    }

    calculateCalorie() {

    }

    setEstimateInfo = (di, du, ta) => {
        this.setState({
            estimateDistance: di,
            estimateDuration: du,
            estimateTarget: ta,
        });
    }

    render_estimateInfo() {
        return (
            <>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.estimateTarget}><MaterialCommunityIcons name='map-marker-radius' size={25} color='#48cfad' /> {`${this.state.estimateTarget}`}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.estimateTime}>{`${parseFloat(this.state.estimateDistance).toFixed(3)} km, ${parseInt(this.state.estimateDuration)} min`}</Text>
                </View>
            </>
        );
    }

    screen_start() {
        return (
            <>
                {this.state.estimateTarget ? this.render_estimateInfo() : null}
                <View style={styles.workoutoption}>
                    <TouchableOpacity style={styles.workoutmode} onPress={() => {
                        if (!this.state.runOption) {
                            this.setState({ runOption: true, bikeOption: false, walkOption: false });
                            this.setDirectionsMode('WALKING');
                        }
                    }}>
                        <MaterialCommunityIcons name="run-fast" size={37} color={this.state.runOption ? '#48cfad' : '#000000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.workoutmode} onPress={() => {
                        if (!this.state.bikeOption) {
                            this.setState({ bikeOption: true, runOption: false, walkOption: false });
                            this.setDirectionsMode('BICYCLING');
                        }
                    }}>
                        <MaterialCommunityIcons name="bike" size={37} color={this.state.bikeOption ? '#48cfad' : '#000000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.workoutmode} onPress={() => {
                        if (!this.state.walkOption) {
                            this.setState({ walkOption: true, runOption: false, bikeOption: false, directionMode: 'WALKING' });
                            this.setDirectionsMode('WALKING');
                        }
                    }}>
                        <MaterialCommunityIcons name="walk" size={37} color={this.state.walkOption ? '#48cfad' : '#000000'} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.startBtnStyle}
                        onPress={() => {
                            if(!this.props.selectedMarker){
                                Alert.alert('Please tap a target marker first');
                                return false;
                            }
                            this.setState({ screenState: 1 });
                            this.startTimer();
                            this.props.isStartCallback(true);
                        }}
                    >
                        <MaterialCommunityIcons name="play-circle-outline" size={70} color='#48cfad' />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    screen_run() {
        return (
            <>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', marginTop: 10, height: 100, fontSize: 18 }}>{this.calculateDistance()}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <View style={{ flexDirection: 'column', flex: 2 }}>
                        <View style={styles.stats}>
                            <Text>Time</Text>
                            <Text>Speed</Text>
                            <Text>Calorie</Text>
                        </View>
                        <View style={styles.stats}>
                            <Text>{TimeFormatter(this.state.mainTimer)}</Text>
                            <Text>{this.calculateSpeed()} km/h</Text>
                            <Text>358 cal</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.startBtnStyle}
                        onPress={() => {
                            this.setState({ screenState: 2});
                            this.pauseTimer();
                            this.props.isStartCallback(false);
                        }}
                    >
                        <MaterialCommunityIcons name="pause-circle-outline" size={70} color='#48cfad' />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    screen_pause() {
        return (
            <>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', marginTop: 10, height: 100, fontSize: 18 }}>{this.calculateDistance()}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <View style={{ flexDirection: 'column', flex: 2 }}>
                        <View style={styles.stats}>
                            <Text>Time</Text>
                            <Text>Speed</Text>
                            <Text>Calorie</Text>
                        </View>
                        <View style={styles.stats}>
                            <Text>{TimeFormatter(this.state.mainTimer)}</Text>
                            <Text>{this.calculateSpeed()} km/h</Text>
                            <Text>358 cal</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={styles.startBtnColStyle}
                        onPress={() => {
                            Alert.alert(
                                //title
                                'Message',
                                //body
                                'Are you sure stop exercise ?',
                                [
                                    { text: 'Yes', onPress: () => { this.stopTimer(); this.setState({ screenState: 0 }) } },
                                    { text: 'No', onPress: () => { this.pauseTimer() }, style: 'cancel' },
                                ],
                                { cancelable: false }
                                //clicking out side of alert will not cancel
                            );
                        }}
                    >
                        <MaterialCommunityIcons name="stop-circle" size={70} color='#DB0707' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.startBtnColStyle}
                        onPress={() => {
                            this.setState({ screenState: 1});
                            this.resumeTimer();
                            this.props.isStartCallback(true);
                        }}
                    >
                        <MaterialCommunityIcons name="play-circle-outline" size={70} color='#48cfad' />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    render_operation() {
        if (this.state.screenState == 0) {
            return this.screen_start()
        } else if (this.state.screenState == 1) {
            return this.screen_run();
        } else if (this.state.screenState == 2) {
            return this.screen_pause();
        }
    }



    render() {
        return (
            <>
                {this.render_operation()}
            </>
        );
    }

};

const styles = StyleSheet.create({
    startBtnStyle: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    startBtnColStyle: {
        padding: 5,
        alignItems: 'center',
        margin: 10
    },
    workoutoption: {
        marginTop: 10,
        textAlign: 'center',
        flexDirection: 'row',
    },
    workoutmode: {
        margin: 5,
        paddingLeft: 16,
        paddingRight: 16,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
        alignItems: 'center',
    },
    estimateTarget: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#48cfad'
    },
    estimateTime: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: '#48cfad'
    }
});

export default Workout;
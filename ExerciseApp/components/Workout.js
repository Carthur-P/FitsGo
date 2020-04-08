import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, YellowBox, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TimeFormatter from 'minutes-seconds-milliseconds';
import firebase from 'firebase';
import { db } from '../components/common/config';
import { duration } from 'moment';

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
            directonM: 'WALKING'
        };
    }

    startTimer = () => {
        this.props.timerOnCallback(true);
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
        this.setState({ timerOn: true });
        clearInterval(this.timer);
        this.setState({ startTime: this.state.mainTimer });
        this.startTimer();
    }

    stopTimer = () => {
        this.props.timerOnCallback(false);
        this.setState({ 
            timerOn: false,
            startTime: 0, 
            mainTimer: 0
         });
        clearInterval(this.timer);
    }
K
    setDirectionsMode = (m) => {
        this.props.mapDirectionsModeCallback(m);
        this.setState({ directonM: m })
    }

    resetDistanceTravelled = (directionMode, realDuration, calories) => {
        this.props.resetDistanceTravelled(directionMode, realDuration, calories);
    }

    calculateSpeed() {
        return parseFloat(this.props.distanceTravelled / (this.state.mainTimer / 1000 / 60 / 60)).toFixed(1);
    }

    calculateDistance() {
        let dis = parseFloat(this.props.distanceTravelled).toFixed(3);
        if (dis < 1) {
            result = dis * 1000 + ' m';
        } else {
            result = parseFloat(dis).toFixed(2) + ' km';
        }
        return result;
    }

    // MET values ref: December 2004(Reviewed 011 / 09) 2004, University of Colorado Hospital, Denver
    // http://www.ucdenver.edu/academics/colleges/medicine/sportsmed/cusm_patient_resources/Documents/Estimating%20Energy%20Expenditure.pdf
    // METS Activity Description
    // 1.0 Sitting Resting metabolic rate
    // 4.0 Bicycling<l0 mph, general leisure
    // 6.0 Bicycling 10-11.9 mph, leisure, slow, light effort
    // 8.0 Bicycling 12 - 13.9 mph, leisure, moderate effort
    // 10.0 Bicycling 14 - 15.9 mph, racing, fast, vigorous effort
    // 12.0 Bicycling 16 - 19 mph, racing / not drafting or > 19 mph drafting, very fast
    // 16.0 Bicycling > 20 mph, racing, not drafting
    // 8.0 Running 5 mph(12 min mile)
    // 9.0 Running 5.2 mph(11.5 min mile)
    // 10.0 Running 6 mph(10 min mile)
    // 11 Running 6.7 mph(9 min m mile)
    // 11.5 Running 7 mph(8.5 min mile)
    // 12.5 Running 7.5 mph(8 min mile)
    // 13.5 Running 8 mph(7.5 min mile)
    // 14.0 Running 8.6 mph(7 min mile)
    // 15.0 Running 9 mph(6.5 min mile)
    // 16.0 Running 10 mph(6 min mile)
    // 18.0 Running 10.9 mph(5.5 min mile)
    // 15.0 Running Running stairs
    // 2.5 Walking 2 mph, level slow pace, firm surface
    // 3.0 Walking 2.5 mph, firm surface
    // 3.5 Walking 3 mph, level, moderate pace, firm surface
    // 4.0 Walking 3.5 - 4 mph, level, brisk, firm surface
    // 4.5 Walking 4.5 mph, level, firm surface, very very brisk
    // 6.5 Walking race walking
    getMET(dm, speed) {
        result = 1;
        switch (dm) {
            case 'WALKING':
                if (speed < 3.2) result = 2.5
                else if (speed < 4) result = 3
                else if (speed < 4.8) result = 3.5
                else if (speed < 6.4) result = 4
                else if (speed < 7.2) result = 4.5
                break;
            case 'BICYCLING':
                if (speed < 16) result = 4.0
                else if (speed < 19) result = 6.0
                else if (speed < 22) result = 8.0
                else if (speed < 25) result = 10.0
                else if (speed < 30) result = 12.0
                else if (speed > 32) result = 16.0
                break;
            case 'RUNNING':
                if (speed < 8) result = 8.0
                else if (speed < 8.4) result = 9.0
                else if (speed < 9.6) result = 10.0
                else if (speed < 10.7) result = 11.0
                else if (speed < 11.2) result = 11.5
                else if (speed < 12) result = 12.5
                else if (speed < 12.8) result = 13.5
                else if (speed < 13.8) result = 14.0
                else if (speed < 14.5) result = 15.0
                else if (speed < 16) result = 16.0
                else if (speed < 17.5) result = 18.0
                break;
        }
        return result;
    }

    getWeight() {
        weight = 0;
        db.ref('/users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let userObj = snapshot.val();
            if (userObj.weight != null) {
                weight = userObj.weight;
            }
        })
        return weight;
    }

    // Formula: (METs * 3.5 * weight(kg) / 200) * duration(min)
    calculateCalorie() {
        cal = 0.0;
        met = this.getMET(this.state.directionMode, this.state.speed);
        weight = this.getWeight();
        durationTime = this.state.mainTimer / 1000 / 60;
        cal = (met * 3.5 * weight / 200) * durationTime;
        return parseFloat(cal).toFixed(2);
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
                            this.setDirectionsMode('RUNNING');
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
                            if (!this.props.selectedMarker) {
                                Alert.alert('Please tap a target marker first');
                                return false;
                            }
                            if (this.getWeight() === '0') {
                                Alert.alert('Please go profile to enter your weight');
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
                    <Text style={styles.textDistance}>{this.calculateDistance()}</Text>
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
                            <Text>{this.calculateCalorie()} cal</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.startBtnStyle}
                        onPress={() => {
                            this.setState({ screenState: 2 });
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
                    <Text style={styles.textDistance}>{this.calculateDistance()}</Text>
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
                            <Text>{this.calculateCalorie()} cal</Text>
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
                                    {
                                        text: 'Yes', onPress: () => {           
                                            this.stopTimer();
                                            this.setState({ screenState: 0 });
                                            this.props.isStartCallback(false);
                                            this.resetDistanceTravelled(this.state.directonM, this.state.mainTimer, this.calculateCalorie())
                                        }
                                    },
                                    {
                                        text: 'No', onPress: () => {
                                            this.pauseTimer();
                                            this.props.isStartCallback(true);
                                        }, style: 'cancel'
                                    },
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
                            this.setState({ screenState: 1 });
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
    },
    textDistance: {
        textAlign: 'center',
        marginTop: 10,
        height: 100,
        fontSize: 18
    }
});

export default Workout;
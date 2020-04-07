import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert, YellowBox, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { db } from './common/config';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon, Callout, Polyline, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Workout from './Workout';
import haversine from 'haversine';

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['MapViewDirections']);
YellowBox.ignoreWarnings(['react-native-maps-directions']);

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyCbxmLQIQys2IrnNpfj1xlhIwxNXgrDNvs';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0422
      },
      data: [],
      markers: [],
      customMarker: [],
      loading: false,
      wayPoints: [],
      tapedMarkerCoords: { latitude: 0, longitude: 0 },
      selectedMarker: '',
      directionMode: 'WALKING', // direction mode with default value WALKING
      routingCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      distance: 0, // The distance between current location to Marker which is user taped on
      duration: 0, // The duration relative distance
      region1: [
        { latitude: -45.808612, longitude: 170.520680 },
        { latitude: -45.836839, longitude: 170.588894 },
        { latitude: -45.851505, longitude: 170.578587 },
        { latitude: -45.860703, longitude: 170.570188 },
        { latitude: -45.843739, longitude: 170.489983 },
        { latitude: -45.808612, longitude: 170.520680 }
      ],
      region2: [
        { latitude: -45.843739, longitude: 170.489983 },
        { latitude: -45.860703, longitude: 170.570188 },
        { latitude: -45.866448, longitude: 170.558297 },
        { latitude: -45.874110, longitude: 170.527129 },
        { latitude: -45.878891, longitude: 170.513251 },
        { latitude: -45.865277, longitude: 170.452692 },
      ],
      region3: [
        { latitude: -45.865277, longitude: 170.452692 },
        { latitude: -45.878891, longitude: 170.513251 },
        { latitude: -45.883665, longitude: 170.507490 },
        { latitude: -45.887479, longitude: 170.507650 },
        { latitude: -45.893111, longitude: 170.517851 },
        { latitude: -45.908963, longitude: 170.517584 },
        { latitude: -45.917928, longitude: 170.485913 },
        { latitude: -45.895166, longitude: 170.458468 },
        { latitude: -45.865277, longitude: 170.452692 }
      ],
      region4: [
        { latitude: -45.893111, longitude: 170.517851 },
        { latitude: -45.882000, longitude: 170.526167 },
        { latitude: -45.878592, longitude: 170.537688 },
        { latitude: -45.878385, longitude: 170.573841 },
        { latitude: -45.907084, longitude: 170.576779 },
        { latitude: -45.910230, longitude: 170.567353 },
        { latitude: -45.911169, longitude: 170.534703 },
        { latitude: -45.908623, longitude: 170.531817 },
        { latitude: -45.908963, longitude: 170.517584 },
        { latitude: -45.893111, longitude: 170.517851 }
      ],
    };

    this.mapView = null;
    this.workout = React.createRef();
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  componentDidMount() {
    this.setState({ loading: true });

    db.ref('runningLocation')
      .on('value', (data) => {
        this.setState({
          data: Object.values(data.val()),
        });
        this.setState({ loading: false });
        navigator.geolocation.getCurrentPosition(position => {
          this.setState({
            mapRegion: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0422
            },
            wayPoints: [
              ...this.state.wayPoints,
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            ],
          });
          this.checkUserInGeofence();
        },
          error => console.log(error),
          {
            enableHighAccuracy: true,
          })

        // navigator.geolocation.watchPosition(position => {
        //   this.setState({
        //     mapRegion: {
        //       latitude: position.coords.latitude,
        //       longitude: position.coords.longitude,
        //       latitudeDelta: 0.0922,
        //       longitudeDelta: 0.0422
        //     },
        //     wayPoints: [
        //       ...this.state.wayPoints,
        //       {
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude
        //       }
        //     ],
        //   });
        //   this.checkUserInGeofence();
        // }, (error) => {
        //   console.log(error)
        // }, {
        //     enableHighAccuracy: true,
        //     timeout: 20000,
        //     maximumAge: 1000,
        //     distanceFilter: 10
        //   });
      }, (error) => {
        console.log("There was an error retrieving the data");
        console.log(error);
      });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  isInPolygon(point, polygonArray) {
    let x = point.latitude
    let y = point.longitude
    let inside = false

    for (let i = 0, j = polygonArray.length - 1; i < polygonArray.length; j = i++) {
      let xLat = polygonArray[i].latitude
      let yLat = polygonArray[i].longitude
      let xLon = polygonArray[j].latitude
      let yLon = polygonArray[j].longitude

      let intersect = ((yLat > y) !== (yLon > y)) && (x < (xLon - xLat) * (y - yLat) / (yLon - yLat) + xLat)
      if (intersect) inside = !inside
    }
    return inside
  }

  getAllMarkers() {
    return (
      this.state.markers.map((marker) => (
        <Marker coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude
        }}
          title={marker.title}
          key={marker.key}
          onPress={(e) => {
            this.setState({
              tapedMarkerCoords: e.nativeEvent.coordinate,
              selectedMarker: marker.title,
            });
          }}
        >
          {/* <Callout>
            <View>
              <Text>
                {this.state.directionMode}{'\n'}
                Destination: {marker.title}{'\n'}
                Distance:  {(this.state.distance).toFixed(2)} km{'\n'}
                Duration: {Math.round(this.state.duration)} min
              </Text>
            </View>
          </Callout> */}
        </Marker >
      ))
    );
  }

  checkMarkerInGeofence(region) {
    this.setState({ markers: [] });
    this.state.data.map((marker) => {
      if (this.isInPolygon({ latitude: marker.lat, longitude: marker.long }, region)) {
        this.setState({
          markers: [
            ...this.state.markers,
            { latitude: marker.lat, longitude: marker.long, key: marker.key, title: marker.title }
          ]
        });
      }
    });
  }

  getCustomMarkers() {
    return (
      this.state.customMarker.map((marker) => (
        <Marker coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} key={marker.key}>
          <View style={styles.customMarker}><Text>{marker.counter}</Text></View>
        </Marker>
      ))
    );
  }

  checkUserInGeofence() {
    if (this.isInPolygon({ latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude }, this.state.region1)) {
      console.log("You are in region 1");
      this.checkMarkerInGeofence(this.state.region1);
      this.setState({
        customMarker: [
          { latitude: -45.863856, longitude: 170.510760, counter: this.countMarkers(this.state.region2), key: 2 },
          { latitude: -45.897945, longitude: 170.489985, counter: this.countMarkers(this.state.region3), key: 3 },
          { latitude: -45.895640, longitude: 170.548241, counter: this.countMarkers(this.state.region4), key: 4 }
        ]
      });
    } else if (this.isInPolygon({ latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude }, this.state.region2)) {
      console.log("You are in region 2");
      this.checkMarkerInGeofence(this.state.region2);
      this.setState({
        customMarker: [
          { latitude: -45.838564, longitude: 170.542902, counter: this.countMarkers(this.state.region1), key: 1 },
          { latitude: -45.897945, longitude: 170.489985, counter: this.countMarkers(this.state.region3), key: 3 },
          { latitude: -45.895640, longitude: 170.548241, counter: this.countMarkers(this.state.region4), key: 4 }
        ]
      });
    } else if (this.isInPolygon({ latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude }, this.state.region3)) {
      console.log("You are in region 3");
      this.checkMarkerInGeofence(this.state.region3);
      this.setState({
        customMarker: [
          { latitude: -45.838564, longitude: 170.542902, counter: this.countMarkers(this.state.region1), key: 1 },
          { latitude: -45.863856, longitude: 170.510760, counter: this.countMarkers(this.state.region2), key: 2 },
          { latitude: -45.895640, longitude: 170.548241, counter: this.countMarkers(this.state.region4), key: 4 }
        ]
      });
    } else if (this.isInPolygon({ latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude }, this.state.region4)) {
      console.log("You are in region 4");
      this.checkMarkerInGeofence(this.state.region4);
      this.setState({
        customMarker: [
          { latitude: -45.838564, longitude: 170.542902, counter: this.countMarkers(this.state.region1), key: 1 },
          { latitude: -45.863856, longitude: 170.510760, counter: this.countMarkers(this.state.region2), key: 2 },
          { latitude: -45.897945, longitude: 170.489985, counter: this.countMarkers(this.state.region3), key: 3 },
        ]
      });
      this.checkMarkerInGeofence(this.state.region4);
    } else {
      this.setState({ markers: [] });
      this.setState({
        customMarker: [
          { latitude: -45.838564, longitude: 170.542902, counter: this.countMarkers(this.state.region1), key: 1 },
          { latitude: -45.863856, longitude: 170.510760, counter: this.countMarkers(this.state.region2), key: 2 },
          { latitude: -45.897945, longitude: 170.489985, counter: this.countMarkers(this.state.region3), key: 3 },
          { latitude: -45.895640, longitude: 170.548241, counter: this.countMarkers(this.state.region4), key: 4 }
        ]
      });
    }
  }

  checkMarkerInGeofence(region) {
    this.setState({ markers: [] });
    this.state.data.map((marker) => {
      if (this.isInPolygon({ latitude: marker.lat, longitude: marker.long }, region)) {
        this.setState({
          markers: [
            ...this.state.markers,
            {
              latitude: marker.lat,
              longitude: marker.long,
              title: marker.title,
              key: marker.key
            }
          ]
        });
      }
    });
  }

  countMarkers(region) {
    let counter = 0;
    this.state.data.map((marker) => {
      if (this.isInPolygon({ latitude: marker.lat, longitude: marker.long }, region)) {
        counter++;
      }
    });
    return counter
  }

  // when user choose WALKING or BIKE get directions mode value
  setDirectionsModeCallback = (m) => {
    this.setState({ directionMode: m });
  }

  // tracking routing and record coordinates and show the line on map
  setIsStartCallback = (status) => {
    if (status === true) {
      // fit to current location with 0.05 delta zool range
      this.mapView.animateToRegion({
        latitude: this.state.mapRegion.latitude,
        longitude: this.state.mapRegion.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      });
      setInterval(() => {
        //start track routing
        this.watchID = navigator.geolocation.watchPosition(position => {
          const { distanceTravelled } = this.state;
          const { latitude, longitude } = position.coords;
          const newCoordinate = {
            latitude,
            longitude
          };

          this.setState({
            // routingCoordinates: routingCoordinates.concat([newCoordinate]),
            routingCoordinates: [
              ...this.state.routingCoordinates,
              {
                latitude,
                longitude,
              }
            ],
            distanceTravelled:
              distanceTravelled + this.calcDistance(newCoordinate),
            prevLatLng: newCoordinate,
          });

        }, (error) => {
          console.log(error)
        }, {
            enableHighAccuracy: true,
            distanceFilter: 20
          });
      }, 10000); // check position each 10 senconds

    }
  }


  render() {
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.container}>
            <MapView style={styles.map}
              ref={c => this.mapView = c}
              region={this.state.mapRegion}
              provider={PROVIDER_GOOGLE}
              showsCompass={true}
              zoomControlEnabled={true}
              showsUserLocation={true}
              showsMyLocationButton={true}
            // onUserLocationChange={(location) => {
            //   const { distanceTravelled } = this.state;
            //   const { latitude, longitude } = location.nativeEvent.coordinate;
            //   const newCoordinate = { latitude, longitude };
            //   this.setState({
            //     routingCoordinates: [
            //       ...this.state.routingCoordinates,
            //       { latitude, longitude }
            //     ],
            //     distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
            //     prevLatLng: newCoordinate,
            //   });
            // }}
            >
              {this.getAllMarkers()}
              <Polygon coordinates={this.state.region1} fillColor="rgba(252, 3, 3, 0.3)" />
              <Polygon coordinates={this.state.region2} fillColor="rgba(3, 19, 252, 0.3)" />
              <Polygon coordinates={this.state.region3} fillColor="rgba(64, 191, 33, 0.3)" />
              <Polygon coordinates={this.state.region4} fillColor="rgba(246, 255, 0, 0.3)" />
              <MapViewDirections
                origin={this.state.wayPoints[0]}
                destination={this.state.tapedMarkerCoords}
                waypoints={(this.state.wayPoints.length > 2) ? this.state.wayPoints.slice(1, -1) : null}
                apikey={GOOGLE_MAPS_APIKEY}
                mode={this.state.directionMode}
                strokeWidth={3}
                strokeColor="blue"
                onStart={(params) => {
                  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
                onReady={result => {
                  // get estimate distance and duration and set it to state
                  this.setState({ distance: result.distance, duration: result.duration });
                  // call workout subcomponent function to update the estimate information
                  // Target: marker name, Distance: estimate distance, Duration: estimate duration from current location to target
                  this.workout.current.setEstimateInfo(this.state.distance, this.state.duration, this.state.selectedMarker);

                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: (width / 20),
                      bottom: (height / 20),
                      left: (width / 20),
                      top: (height / 20),
                    }
                  });
                }}
                onError={(err) => {
                  console.log(err);
                }} >
              </MapViewDirections>
              <Polyline coordinates={this.state.routingCoordinates} strokeColor='pink' strokeWidth={5}></Polyline>
              {this.getCustomMarkers()}
            </MapView>
          </View>
          <View style={styles.infoContainer}>
            <Workout
              ref={this.workout}
              mapDirectionsModeCallback={this.setDirectionsModeCallback}
              distanceTravelled={this.state.distanceTravelled}
              isStartCallback={this.setIsStartCallback}
              selectedMarker={this.state.selectedMarker}
            />
          </View>
        </View >
      );
    }

    else {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  customMarker: {
    width: 35,
    height: 35,
    borderRadius: 100 / 2,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 100 / 2,
    alignItems: 'center',
    justifyContent: 'center',
},
});

export default Map
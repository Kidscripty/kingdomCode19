import React, { useState, useEffect } from 'react';
// import { MapView, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { Platform, Text, View, StyleSheet, TextInput } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as Speech from "expo-speech";
import { Button } from 'react-native';

export default function App() {
  // Constants
  const GPSprecision = 3; // Use GPS longitude/latitude to n decimal places

  // State variables
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [locOfInterest, setLocOfInterest] = useState(null);
  const [triggered, setTriggered] = useState(null);
  const [bibleVerse, setBibleVerse] = useState(null);
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [latNLng, setLatNLng] = useState("");

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const reload = async () => {
    while (true) {
      getLocation();

      await sleep(100);
    }
  }

  // Get (and speak) bible verse
  const getVerse = async () => {
    if (book !== "" && chapter !== "" && verse !== "") {
      const url = "https://bibleapi.co/api/verses/kjv/" + book + "/" + chapter + "/" + verse;
      const response = await fetch(url);
      const json = await response.json();

      setBibleVerse(json.text);

      Speech.speak(json.text);
    }
  }

  // Get current location
  const getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setError('Permission to access location was denied');
    }

    let response = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(response);
    var latNlng = {
      latitude: response.coords.latitude,
      longitude: response.coords.longitude
    };
    setLatNLng(latNLng);
  };

  // Save the current location as the location of interest
  const saveLocation = async () => {
    setLocOfInterest(location);
    setTriggered("no");
  }

  // This will get run every time the location updates
  useEffect(() => {
    // Run check on latitude and longitude
    // If not yet triggered AND location  matches location of interest
    //   Update as triggered
    if (location && location.coords
      && locOfInterest && locOfInterest.coords) {
      var shortLocLat = location.coords.latitude.toPrecision(GPSprecision);
      var shortLocLong = location.coords.longitude.toPrecision(GPSprecision);

      var shortTargLat = locOfInterest.coords.latitude.toPrecision(GPSprecision);
      var shortTargLong = locOfInterest.coords.longitude.toPrecision(GPSprecision);
      if (shortLocLat == shortTargLat
        && shortLocLong == shortTargLong) {
        setTriggered("yes");
      }
      // If triggered AND location does NOT match location of interest
      //   Update as NOT triggered
      else {
        setTriggered("no");
      }
    }
  }, [location]);

  // This will read out the bible verse when triggered
  useEffect(() => {
    // If triggered then read verse
    if (triggered == "yes") {
      getVerse();
    }
    // Else if not triggered then stop reading verse
    else {
      Speech.speak("");
    }
  }, [triggered]);


  // DL just practising ting. Making comments and pushing them.

  // This will only get run once: when the component is first loaded
  useEffect(() => {
    getVerse();

    if (Platform.OS === 'android' && !Constants.isDevice) {
      setError('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      reload();
    }
  }, []);

  // This is what the component renders. Gets returned every time there is a render
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}></Text>
      <TextInput
        style={{ height: 40, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'center' }}
        onChangeText={setBook}
        value={book}
        placeholder="Book of Bible"
      />
      <Text style={styles.paragraph}></Text>
      <TextInput
        style={{ height: 40, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'center' }}
        onChangeText={setChapter}
        value={chapter}
        placeholder="Chapter"
      />
      <Text style={styles.paragraph}></Text>
      <TextInput
        style={{ height: 40, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'center' }}
        onChangeText={setVerse}
        value={verse}
        placeholder="Verse"
      />
      <Text style={styles.paragraph}>&nbsp;</Text>
      {(location && location.coords) ? (<>
        <MapView
          style={{
            flex: 1
          }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002
          }}>
          {/* <marker coordinate={latNLng}
            title="Hello"
            description="How are you?" /> */}
        </MapView>
      </>) : (
          <Text></Text>
        )}
      <Button
        onPress={saveLocation}
        title="Save Location"
        color="#841584"
        accessibilityLabel="Save current location"
      />
      {(triggered && triggered == "yes") ? (<>
        <Text style={styles.paragraph}>{bibleVerse}</Text>
      </>) : (
          <Text></Text>
        )}
    </View>
  );
}

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    marginTop: 24,
    marginBottom: 6,
    fontSize: 18,
    textAlign: 'center',
  },
});
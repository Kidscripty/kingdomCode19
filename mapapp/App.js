import React, {useState, useEffect} from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as Speech from "expo-speech";

export default function App() {
  // State variables
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const reload = async () => {
    while(true) {
      getLocation();

      await sleep(100);
    }
  }

  const getVerse = async () => {
    const response = await fetch("https://bibleapi.co/api/verses/kjv/gn/3/3");
    const json = await response.json();

    Speech.speak(json.text);
  }

  const getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setError('Permission to access location was denied');
    }

    let response = await Location.getCurrentPositionAsync({});
    setLocation(response);
  };

  // This will get run every time the location updates
  useEffect(() => {
    // Run check on latitude and longitude
  }, [location]);

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
      {(location && location.coords) ? (<>
        <Text style={styles.paragraph}>Latitude</Text>
        <Text style={styles.paragraph}>{location.coords.latitude}</Text>
        <Text style={styles.paragraph}>Longitude</Text>
        <Text style={styles.paragraph}>{location.coords.longitude}</Text>
      </>) : (
        <Text>Loading...</Text>
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
    margin: 24,
    fontSize: 18,
    textAlign: 'left',
  },
});
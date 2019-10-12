import React, {useState, useEffect} from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as Speech from "expo-speech";

export default function App() {
  let text = 'Waiting..';

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const reload = async () => {
    while(true) {
      _getLocationAsync();

      await sleep(100);
    }
  }

  const getVerse = async () => {
    const response = await fetch("https://bibleapi.co/api/verses/kjv/gn/1/1");
    const json = await response.json();

    Speech.speak(json.text);
  }

  useEffect(() => {
    getVerse();

    if (Platform.OS === 'android' && !Constants.isDevice) {
      setError('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      reload();
    }
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setError('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  if (error) {
    text = error;
  } else if (location) {
    text = location;
  }

  return (
    <View style={styles.container}>
      {text.coords ? (<>
        <Text style={styles.paragraph}>Latitude</Text>
        <Text style={styles.paragraph}>{text.coords.latitude}</Text>
        <Text style={styles.paragraph}>Longitude</Text>
        <Text style={styles.paragraph}>{text.coords.longitude}</Text>
      </>) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

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
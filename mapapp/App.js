import React, {useState, useEffect} from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as Speech from "expo-speech";
import { Button } from 'react-native';

export default function App() {
  // State variables
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [locOfInterest, setLocOfInterest] = useState(null);
  const [triggered, setTriggered] = useState(null);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const reload = async () => {
    while(true) {
      getLocation();

      await sleep(100);
    }
  }

  // Get (and speak) bible verse
  const getVerse = async () => {
    const response = await fetch("https://bibleapi.co/api/verses/kjv/gn/3/3");
    const json = await response.json();

    Speech.speak(json.text);
  }

  // Get current location
  const getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setError('Permission to access location was denied');
    }

    let response = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
    setLocation(response);
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
    if (location == locOfInterest)
    {
      setTriggered("yes");
    }
    // If triggered AND location does NOT match location of interest
    //   Update as NOT triggered
    else
    {
      setTriggered("no");
    }
  }, [location]);

  // This will read out the bible verse when triggered
  useEffect(() => {
    // If triggered then read verse
    if (triggered == "yes")
    {
      getVerse();
    }
    // Else if not triggered then stop reading verse
    else
    {
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
      {(location && location.coords) ? (<>
        <Text style={styles.paragraph}>Latitude</Text>
        <Text style={styles.paragraph}>{location.coords.latitude}</Text>
        <Text style={styles.paragraph}>Longitude</Text>
        <Text style={styles.paragraph}>{location.coords.longitude}</Text>
      </>) : (
        <Text>Loading...</Text>
      )}
      <Button
        onPress={saveLocation}
        title="Save Location"
        color="#841584"
        accessibilityLabel="Save current location"
      />
      {(locOfInterest && location.coords) ? (<>
        <Text style={styles.paragraph}>Latitude</Text>
        <Text style={styles.paragraph}>{location.coords.latitude}</Text>
        <Text style={styles.paragraph}>Longitude</Text>
        <Text style={styles.paragraph}>{location.coords.longitude}</Text>
      </>) : (
        <Text>Nothing Saved.</Text>
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
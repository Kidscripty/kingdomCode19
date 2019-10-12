import React, {useState, useEffect} from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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

  useEffect(() => {
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
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
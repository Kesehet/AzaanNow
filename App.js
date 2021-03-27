import React, { useState, useEffect } from 'react';
import { Platform,SafeAreaView,FlatList, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import {getDistance, getPreciseDistance} from 'geolib';
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  var Dataset = [{ name: "Ahle Hadees Masjid (Rough)", latitude: 28.557531, longitude: 77.292735 },
    { name: "Bilal Masjid (Rough)", latitude: 28.558281, longitude: 77.294032 }
  ];
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Loading..';
  if (errorMsg) {
    text = errorMsg;
  }
  else if (location) {
    var newDataset = [];
    var i = 0;
    Dataset.forEach((e) => {
      var mylocation = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      var destinationlocation = { latitude: e.latitude, longitude: e.longitude };
      var tempObj = {id:i, name:e.name,longitude:e.longitude,latitude:e.latitude,distance:getPreciseDistance(mylocation,destinationlocation)}
      newDataset.push(tempObj);
      i++;
    });
    newDataset.sort((a, b) => {
      return a.distance - b.distance;
    });
    Dataset = newDataset;
    
  }
  const renderItem = ({ item }) => <Item name={item.name} distance={item.distance} />;
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <SafeAreaView style={styles.container}>
        <FlatList data={Dataset} renderItem={renderItem} keyExtractor={item => item.id} />
      </SafeAreaView>
    </View>
  );
}
const Item = ({ name,distance }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{name}</Text>
    <Text style={styles.paragraph}>{distance == undefined ? "Calculating Distance...":distance+" meters" }</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f4c5f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

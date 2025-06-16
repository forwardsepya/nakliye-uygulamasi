import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

export default function AdresAutocompleteInput({
  placeholder,
  onSelect,
  disableKonumSecenegi = false
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [konumSecenegi, setKonumSecenegi] = useState(null);

  // Konumunuz seçeneğini isteğe bağlı al
  useEffect(() => {
    if (disableKonumSecenegi) return;

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let location = await Location.getCurrentPositionAsync({});
        const konum = {
          display_name: '📍 Konumunuz',
          lat: location.coords.latitude,
          lon: location.coords.longitude
        };
        setKonumSecenegi(konum);
      } catch (err) {
        console.log("Konum alınamadı:", err);
      }
    })();
  }, [disableKonumSecenegi]);

  const handleChange = async (text) => {
    setQuery(text);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: text,
          format: 'json',
          addressdetails: 1,
          countrycodes: 'tr',
          limit: 5
        },
        headers: {
          'User-Agent': 'nakliye-app-frontend'
        }
      });

      setResults(response.data);
    } catch (err) {
      console.error('Adres arama hatası:', err);
    }
  };

  // Konum seçeneğini listeye ekle
  const combinedResults = (!disableKonumSecenegi && konumSecenegi)
    ? [konumSecenegi, ...results]
    : results;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={handleChange}
      />
      {combinedResults.length > 0 && (
        <FlatList
          data={combinedResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.result}
              onPress={() => {
                setQuery(item.display_name);
                setResults([]);
                onSelect(item);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15
  },
  result: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});

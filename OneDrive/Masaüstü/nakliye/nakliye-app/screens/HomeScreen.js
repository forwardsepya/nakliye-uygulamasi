import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import * as Location from 'expo-location';
import YukDetayForm from '../components/YukDetayForm';

export default function HomeScreen() {
  const [nakliyeciler, setNakliyeciler] = useState([]);
  const [konum, setKonum] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Hata', 'Konum izni verilmedi.');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setKonum({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (err) {
        Alert.alert("Hata", "Konum alınamadı.");
        console.log("Konum Hatası:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const nakliyeRef = ref(db, 'nakliyeciler/');
    const unsubscribe = onValue(nakliyeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const liste = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setNakliyeciler(liste);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text>Konum alınıyor...</Text>
      </View>
    );
  }

  if (!konum) {
    return (
      <View style={styles.center}>
        <Text>Konum bilgisi alınamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: konum.latitude,
          longitude: konum.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
        showsUserLocation={true}
      >
        {nakliyeciler.map((nakliyeci) => (
          <Marker
            key={nakliyeci.id}
            coordinate={{
              latitude: nakliyeci.latitude || 0,
              longitude: nakliyeci.longitude || 0
            }}
            title="Nakliyeci"
            description={nakliyeci.aracTuru || 'Bilinmeyen Araç'}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.buton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.butonText}>+ Yük Oluştur</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <YukDetayForm
          onClose={() => setModalVisible(false)}
          mevcutKonum={konum}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  buton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 8
  },
  butonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

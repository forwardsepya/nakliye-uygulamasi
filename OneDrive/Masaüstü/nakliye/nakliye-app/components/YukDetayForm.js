import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import AdresAutocompleteInput from './AdresAutocompleteInput';

export default function YukDetayForm({ onClose, mevcutKonum }) {
  const [esya, setEsya] = useState('');
  const [agirlik, setAgirlik] = useState('');
  const [nereden, setNereden] = useState('');
  const [nereye, setNereye] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [aracTuru, setAracTuru] = useState(null);

  const aracSecenekleri = ['Panelvan', 'Frigorifik', 'Kamyonet', 'Kamyon'];

  const handleSubmit = () => {
    if (!esya || !nereden || !nereye || !latitude || !longitude || !aracTuru) {
      Alert.alert("Eksik bilgi", "Tüm alanları doldurun.");
      return;
    }

    const yeniYuk = {
      esya,
      agirlik,
      nereden,
      nereye,
      zaman: new Date().toISOString(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      aracTuru
    };

    const yukRef = ref(db, 'yukler/');
    push(yukRef, yeniYuk)
      .then(() => {
        Alert.alert("Başarılı", "Yük oluşturuldu.");
        onClose();
      })
      .catch((error) => {
        console.error("Firebase'e yükleme hatası:", error);
        Alert.alert("Hata", "Yük kaydedilemedi.");
      });
  };

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>📦 Yük Oluştur</Text>

      <AdresAutocompleteInput
        placeholder="Nereden alınacak?"
        onSelect={(item) => {
          setNereden(item.display_name);
          setLatitude(item.lat);
          setLongitude(item.lon);
        }}
      />

      <AdresAutocompleteInput
        placeholder="Nereye taşınacak?"
        onSelect={(item) => {
          setNereye(item.display_name);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Taşınacak ürün nedir?"
        value={esya}
        onChangeText={setEsya}
      />

      <TextInput
        style={styles.input}
        placeholder="Tahmini ağırlık (kg)"
        value={agirlik}
        onChangeText={setAgirlik}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Araç Seçimi:</Text>
      <View style={styles.aracContainer}>
        {aracSecenekleri.map((secenek) => (
          <TouchableOpacity
            key={secenek}
            style={[
              styles.aracButon,
              aracTuru === secenek && styles.seciliButon
            ]}
            onPress={() => setAracTuru(secenek)}
          >
            <Text style={styles.aracText}>{secenek}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Araç Çağır</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose}>
        <Text style={styles.kapat}>Kapat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 8
  },
  aracContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  aracButon: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
    marginTop: 8
  },
  seciliButon: {
    backgroundColor: '#1e90ff'
  },
  aracText: {
    color: '#000'
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  kapat: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 10
  }
});

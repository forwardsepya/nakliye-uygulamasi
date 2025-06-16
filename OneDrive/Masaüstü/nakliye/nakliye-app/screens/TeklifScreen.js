import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import { db } from '../firebase';
import { ref, push } from 'firebase/database';

export default function TeklifScreen({ route, navigation, uid }) {
  const yuk = route.params?.yuk || {};
  const [teklif, setTeklif] = useState('');

  const handleTeklifGonder = () => {
    if (!teklif) {
      Alert.alert("Eksik bilgi", "Lütfen bir teklif fiyatı girin.");
      return;
    }

    const teklifData = {
      yukId: yuk.id,
      yukBaslik: yuk.esya,
      nereden: yuk.nereden,
      nereye: yuk.nereye,
      agirlik: yuk.agirlik,
      teklifMiktari: parseInt(teklif),
      zaman: new Date().toISOString(),
      teklifVerenId: uid,
      durum: 'Bekliyor'
    };

    const tekliflerRef = ref(db, 'teklifler/');
    push(tekliflerRef, teklifData)
      .then(() => {
        Alert.alert("Başarılı", "Teklif gönderildi.");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Teklif gönderilemedi:", error);
        Alert.alert("Hata", "Teklif kaydedilemedi.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>📦 Yük Detayı</Text>
      <Text style={styles.label}>Eşya: {yuk.esya}</Text>
      <Text style={styles.label}>Nereden: {yuk.nereden}</Text>
      <Text style={styles.label}>Nereye: {yuk.nereye}</Text>
      <Text style={styles.label}>Ağırlık: {yuk.agirlik || 'Bilinmiyor'}</Text>
      <Text style={styles.label}>Araç Tipi: {yuk.aracTuru || 'Bilinmiyor'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Teklif fiyatı (₺)"
        keyboardType="numeric"
        value={teklif}
        onChangeText={setTeklif}
      />

      <TouchableOpacity style={styles.button} onPress={handleTeklifGonder}>
        <Text style={styles.buttonText}>Teklif Ver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

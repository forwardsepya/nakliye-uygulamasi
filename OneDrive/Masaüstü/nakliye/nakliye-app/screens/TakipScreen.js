import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export default function TakipScreen({ uid }) {
  const [teklifler, setTeklifler] = useState([]);

  useEffect(() => {
    const teklifRef = ref(db, 'teklifler/');

    const unsubscribe = onValue(teklifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const kullanicininTeklifleri = Object.values(data).filter(
          (item) => item.teklifVerenId === uid
        );
        setTeklifler(kullanicininTeklifleri);
      } else {
        setTeklifler([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.baslik}>📦 {item.yukBaslik || 'Yük Başlığı Yok'}</Text>
      <Text>📍 {item.nereden} ➡️ {item.nereye}</Text>
      <Text>🚛 Araç: {item.aracTuru || 'Bilinmiyor'}</Text>
      <Text>💰 Teklifin: {item.teklifMiktari} ₺</Text>
      <Text>📌 Durum: {item.durum || 'Bekliyor'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 Tekliflerim</Text>
      <FlatList
        data={teklifler}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Hiç teklifin yok 😢</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  baslik: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});

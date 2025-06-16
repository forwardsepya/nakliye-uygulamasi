import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelectScreen() {
  const navigation = useNavigation();

  const handleSelectRole = async (role) => {
    try {
      await AsyncStorage.setItem('kullanici_rolu', role);
      navigation.replace('Login'); // LoginScreen'e yönlendir
    } catch (e) {
      console.log("Rol kaydedilemedi:", e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#1e90ff' }]}
        onPress={() => handleSelectRole('tasiyacak')}
      >
        <Text style={styles.text}>🚛 Taşıtan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]}
        onPress={() => handleSelectRole('nakliyeci')}
      >
        <Text style={styles.text}>🚚 Nakliyeci</Text>
      </TouchableOpacity>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Dikey bölünmüş ekran
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5'
  },
  button: {
    width: '80%',
    height: height * 0.2,
    borderRadius: 20,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  }
});

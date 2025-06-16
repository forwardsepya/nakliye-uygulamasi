// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !sifre) {
      Alert.alert("Uyarı", "Tüm alanları doldurun.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, sifre);
      Alert.alert("Başarılı", "Kayıt başarılı!");
      navigation.replace('Home');
    } catch (error) {
      console.log("Kayıt Hatası:", error);
      Alert.alert("Hata", error.message || "Kayıt başarısız.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        placeholder="E-posta"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Şifre"
        style={styles.input}
        value={sifre}
        onChangeText={setSifre}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.toggleText}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20
  },
  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 15, backgroundColor: '#fff', marginBottom: 15
  },
  button: {
    backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center'
  },
  buttonText: {
    color: '#fff', fontSize: 18, fontWeight: 'bold'
  },
  toggleText: {
    marginTop: 15, textAlign: 'center', color: '#555'
  }
});

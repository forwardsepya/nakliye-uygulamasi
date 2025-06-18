import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');

  const handleLogin = async () => {
    if (!email || !sifre) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, sifre);
      Alert.alert("Giriş Başarılı", "Hoş geldin!");
      navigation.replace('Home');
    } catch (error) {
      console.log("Giriş Hatası:", error);
      Alert.alert("Hata", error.message || "Bir hata oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Register')}>
        <Text style={styles.toggleText}>Hesabın yok mu? Kayıt Ol</Text>
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
    backgroundColor: '#1e90ff', padding: 15, borderRadius: 10, alignItems: 'center'
  },
  buttonText: {
    color: '#fff', fontSize: 18, fontWeight: 'bold'
  },
  toggleText: {
    marginTop: 15, textAlign: 'center', color: '#555'
  }
});

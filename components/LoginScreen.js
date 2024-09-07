import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

// LoginScreen.js
const handleLogin = async () => {
  try {
    const users = await AsyncStorage.getItem('users');
    const usersArray = users ? JSON.parse(users) : [];
    const user = usersArray.find(u => u.email === email && u.password === password);

    if (user) {
      await AsyncStorage.setItem('currentUser', email); // Guardar el correo del usuario logueado
      navigation.navigate('Drawer');
    } else {
      Alert.alert('Error', 'Correo o contraseña incorrectos.');
    }
  } catch (e) {
    console.error(e);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Ingresar" onPress={handleLogin} />  
      <Text style={styles.text}>
       ¿No tienes una cuenta?
      </Text>       
      <Text style={styles.registerText} onPress={() => navigation.navigate('Registro')}>
       Regístrate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  registerText: { marginTop: 5, color: 'blue', textAlign: 'center' },
  text: { marginTop: 20, color: 'black', textAlign: 'center' },
});

export default LoginScreen;

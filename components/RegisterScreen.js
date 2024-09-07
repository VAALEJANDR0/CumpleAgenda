import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Expresión regular para validar el correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async () => {
    try {
      // Verificar que todos los campos estén completos
      if (!username || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Por favor, completa todos los campos.');
        return;
      }

      // Verificar si el correo es válido
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Por favor, ingresa un correo válido.');
        return;
      }

      // Verificar si las contraseñas coinciden
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      // Obtener usuarios existentes desde AsyncStorage
      const users = await AsyncStorage.getItem('users');
      const usersArray = users ? JSON.parse(users) : [];

      // Verificar si ya existe un usuario con el mismo correo
      const userExists = usersArray.some(user => user.email === email);

      if (userExists) {
        Alert.alert('Error', 'Ya existe una cuenta con este correo.');
        return;
      }

      // Añadir nuevo usuario
      const newUser = { username, email, password };
      usersArray.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(usersArray));

      Alert.alert('Registro Exitoso', 'Usuario registrado correctamente.');
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});

export default RegisterScreen;

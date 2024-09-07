import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';  // para formatear la fecha

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Expresiones regulares para las validaciones
  const nameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{4}-\d{4}$/;

  // Mostrar el DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Ocultar el DatePicker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Manejar la selección de la fecha
  const handleConfirm = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setBirthday(formattedDate);
    hideDatePicker();
  };

  // Función para validar los campos
  const validateFields = () => {
    if (!nameRegex.test(name)) {
      Alert.alert('Error', 'El nombre solo debe contener letras.');
      return false;
    }

    if (!nameRegex.test(surname)) {
      Alert.alert('Error', 'El apellido solo debe contener letras.');
      return false;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingrese un correo válido.');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'El número de teléfono debe estar en el formato 0000-0000.');
      return false;
    }

    if (!birthday) {
      Alert.alert('Error', 'Por favor, seleccione una fecha de nacimiento.');
      return false;
    }

    return true;
  };

  // Función para agregar el contacto
  const handleAddContact = async () => {
    if (!validateFields()) return;
  
    const newContact = { name, surname, email, phone, birthday };
    const currentUser = await AsyncStorage.getItem('currentUser'); // Obtener el usuario actual
    const contacts = await AsyncStorage.getItem(`contacts_${currentUser}`); // Obtener los contactos específicos de este usuario
    const contactsArray = contacts ? JSON.parse(contacts) : [];
    contactsArray.push(newContact);
    await AsyncStorage.setItem(`contacts_${currentUser}`, JSON.stringify(contactsArray));
    navigation.navigate('Contactos');
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        value={phone}
        onChangeText={setPhone}
      />
      
      {/* Mostrar la fecha seleccionada */}
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          style={styles.input}
          placeholder="Fecha de nacimiento"
          value={birthday}
          editable={false}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Button title="Agregar Persona" onPress={handleAddContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});

export default AddContactScreen;

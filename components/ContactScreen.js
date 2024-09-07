import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment'; // para manejar las fechas

// Asegúrate de que 'navigation' se pasa como prop
const ContactScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null); // Para almacenar el contacto seleccionado
  const [isModalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal

  // Cargar contactos cada vez que la pantalla se enfoca
  useFocusEffect(
    React.useCallback(() => {
      const loadContacts = async () => {
        const currentUser = await AsyncStorage.getItem('currentUser'); // Obtener el usuario actual
        const storedContacts = await AsyncStorage.getItem(`contacts_${currentUser}`); // Obtener los contactos específicos de este usuario
        setContacts(storedContacts ? JSON.parse(storedContacts) : []);
      };
      loadContacts();
    }, [])
  );
  

  // Función para eliminar un contacto
  const handleDeleteContact = (index) => {
    Alert.alert(
      "Eliminar contacto",
      "¿Estás seguro de que deseas eliminar este contacto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const updatedContacts = contacts.filter((_, i) => i !== index);
            setContacts(updatedContacts);
            await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
          }
        }
      ]
    );
  };

  // Función para calcular la diferencia de días entre la fecha actual y la fecha de cumpleaños
  const calculateDaysUntilBirthday = (birthday) => {
    const today = moment();
    const birthDate = moment(birthday, 'DD/MM/YYYY').year(today.year()); // cumpleaños este año

    // Si el cumpleaños ya pasó este año, devolvemos un valor negativo
    if (birthDate.isBefore(today, 'day')) {
      return birthDate.diff(today, 'days'); // diferencia negativa
    }

    return birthDate.diff(today, 'days'); // diferencia positiva o cero (cumpleaños hoy)
  };

  // Función para determinar el estilo de cada contacto según los días hasta el cumpleaños
  const getContactStyle = (birthday) => {
    const daysUntilBirthday = calculateDaysUntilBirthday(birthday);

    if (daysUntilBirthday === 0) {
      return styles.today; // Cumpleaños hoy (verde)
    } else if (daysUntilBirthday < 0) {
      return styles.past; // Cumpleaños pasado (rojo)
    } else {
      return styles.upcoming; // Cumpleaños en el futuro (azul)
    }
  };

  // Función para abrir el modal con los detalles del contacto
  const openModal = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedContact(null);
    setModalVisible(false);
  };

  // Renderizar cada contacto en la lista
  const renderItem = ({ item, index }) => {
    const daysUntilBirthday = calculateDaysUntilBirthday(item.birthday);
    return (
      <TouchableOpacity
        onPress={() => openModal(item)} // Abre el modal al tocar el contacto
        onLongPress={() => handleDeleteContact(index)} // Permitir eliminar con un "long press"
        style={[styles.contactItem, getContactStyle(item.birthday)]}
      >
        <Text style={styles.contactText}>{item.name}</Text>
        <Text style={styles.daysText}>
          {daysUntilBirthday === 0
            ? 'Hoy Cumpleaños'
            : daysUntilBirthday < 0
            ? 'Pasado'
            : `${daysUntilBirthday} días`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <Text>No hay registros!! 😔</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Agregar Contacto')} // Asegúrate de que se recibe 'navigation'
      />

      {/* Modal para mostrar los detalles del contacto */}
      {selectedContact && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Nombre: {selectedContact.name}</Text>
              <Text style={styles.label}>Apellido: {selectedContact.surname}</Text>
              <Text style={styles.label}>Correo: {selectedContact.email}</Text>
              <Text style={styles.label}>Teléfono: {selectedContact.phone}</Text>
              <Text style={styles.label}>Cumpleaños: {selectedContact.birthday}</Text>

              <Button title="Cerrar" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  contactItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactText: { fontSize: 18, fontWeight: 'bold' },
  daysText: { fontSize: 16, fontStyle: 'italic' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },

  // Estilos de colores según la proximidad del cumpleaños
  today: { backgroundColor: '#7CFC00' }, // Verde
  past: { backgroundColor: 'red' }, // Rojo
  upcoming: { backgroundColor: 'blue' }, // Azul

  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo transparente oscuro
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  label: { fontSize: 18, marginBottom: 10 },
});

export default ContactScreen;

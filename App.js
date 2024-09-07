// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ContactScreen from './components/ContactScreen';
import AddContactScreen from './components/AddContactScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


function CustomDrawerContent(props) {
  const handleLogout = async () => {
    // No se borra ningún dato, solo navegamos de vuelta al Login
    props.navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar Sesión"
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Contactos"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Contactos" component={ContactScreen} />
      <Drawer.Screen name="Agregar Contacto" component={AddContactScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Inicio de Sesión' }}
        />
        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ title: 'Registro de Usuario' }}
        />
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// firebase-login/FirebaseLogin.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import appFirebase from '../credenciales';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(appFirebase);

const FirebaseLogin = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Inicio de sesión exitoso', '¡Bienvenido!');
        setIsLoggedIn(true); // Cambia el estado a "logged in" para mostrar el AppDrawer
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Error', 'El correo electrónico es inválido.');
            break;
          case 'auth/user-not-found':
            Alert.alert('Error', 'No se encontró una cuenta con este correo.');
            break;
          case 'auth/wrong-password':
            Alert.alert('Error', 'La contraseña es incorrecta.');
            break;
          default:
            Alert.alert('Error', 'Ocurrió un error inesperado. Intenta de nuevo.');
            break;
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button title="Crear cuenta" onPress={() => navigation.navigate('CrearCuenta')} />
      <Button title="Recuperar contraseña" onPress={() => navigation.navigate('RecuperarCuenta')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default FirebaseLogin;

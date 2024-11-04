// firebase-login/FirebaseRecuperarCuenta.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import appFirebase from '../credenciales';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth(appFirebase);

const FirebaseRecuperarCuenta = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Recuperación de contraseña', 'Revisa tu correo para recuperar la contraseña.');
        navigation.navigate('Login');
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Error', 'El correo electrónico es inválido.');
            break;
          case 'auth/user-not-found':
            Alert.alert('Error', 'No se encontró una cuenta con este correo.');
            break;
          default:
            Alert.alert('Error', 'Ocurrió un error inesperado. Intenta de nuevo.');
            break;
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Enviar correo de recuperación" onPress={handlePasswordReset} />
      <Button title="Volver al inicio de sesión" onPress={() => navigation.navigate('Login')} />
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

export default FirebaseRecuperarCuenta;

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
        setIsLoggedIn(true);
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
    <View style={styles.backgroundContainer}>
      {/* Título HendyCash más arriba y con estilo personalizado */}
      <Text style={styles.appTitle}>HendyCash</Text>
      <View style={styles.formContainer}>
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
        <View style={styles.buttonContainer}>
          <Button title="Iniciar sesión" onPress={handleLogin} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Crear cuenta" onPress={() => navigation.navigate('CrearCuenta')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Recuperar contraseña" onPress={() => navigation.navigate('RecuperarCuenta')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: 'rgba(75, 0, 130, 0.8)', // Fondo lila oscuro con opacidad
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 48, // Tamaño grande
    fontWeight: 'bold',
    color: '#000',
    textShadowColor: '#FFF', // Contorno blanco alrededor del texto
    textShadowOffset: { width: -2, height: -2 },
    textShadowRadius: 1,
    fontFamily: 'Pacifico', // Cambia por la fuente deseada
    textAlign: 'center',
    marginBottom: 60, // Mayor separación del formulario
  },
  formContainer: {
    backgroundColor: '#fff', // Fondo blanco ajustado al formulario
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5, // Separación vertical entre botones
  },
});

export default FirebaseLogin;

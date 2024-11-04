// FirebaseGuardar.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const FirebaseGuardar = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date());

  const guardarDato = async () => {
    if (!nombre || !tipo || !monto) {
      Alert.alert('Error', 'Debe completar todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'Finanza'), {
        nombre,
        Tipo: tipo,
        Monto: parseFloat(monto),
        Fecha: fecha,
      });
      Alert.alert('Éxito', 'Dato guardado correctamente');
      setNombre('');
      setTipo('');
      setMonto('');
      setFecha(new Date());
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el dato');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Tipo" value={tipo} onChangeText={setTipo} style={styles.input} />
      <TextInput placeholder="Monto en Gs." value={monto} onChangeText={setMonto} keyboardType="numeric" style={styles.input} />
      <Button title="Guardar" onPress={guardarDato} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ddd' },
});

export default FirebaseGuardar;

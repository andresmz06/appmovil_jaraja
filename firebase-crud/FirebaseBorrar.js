// FirebaseBorrar.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const FirebaseBorrar = () => {
  const [id, setId] = useState('');

  const borrarDato = async () => {
    if (!id) {
      Alert.alert('Error', 'Debe ingresar un ID válido');
      return;
    }

    try {
      await deleteDoc(doc(db, 'Finanza', id));
      Alert.alert('Éxito', 'Dato borrado correctamente');
      setId('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo borrar el dato');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="ID del documento" value={id} onChangeText={setId} style={styles.input} />
      <Button title="Borrar" onPress={borrarDato} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ddd' },
});

export default FirebaseBorrar;

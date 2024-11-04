// FirebaseEditar.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const FirebaseEditar = () => {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date());

  const editarDato = async () => {
    if (!id || !nombre || !tipo || !monto) {
      Alert.alert('Error', 'Debe completar todos los campos');
      return;
    }

    try {
      const docRef = doc(db, 'Finanza', id);
      await updateDoc(docRef, {
        nombre,
        Tipo: tipo,
        Monto: parseFloat(monto),
        Fecha: fecha,
      });
      Alert.alert('Éxito', 'Dato actualizado correctamente');
      setId('');
      setNombre('');
      setTipo('');
      setMonto('');
      setFecha(new Date());
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el dato');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="ID del documento" value={id} onChangeText={setId} style={styles.input} />
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Tipo" value={tipo} onChangeText={setTipo} style={styles.input} />
      <TextInput placeholder="Monto en Gs." value={monto} onChangeText={setMonto} keyboardType="numeric" style={styles.input} />
      <Button title="Actualizar" onPress={editarDato} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ddd' },
});

export default FirebaseEditar;

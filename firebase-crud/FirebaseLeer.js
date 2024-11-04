// FirebaseLeer.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const FirebaseLeer = () => {
  const [finanzas, setFinanzas] = useState([]);

  const leerDatos = async () => {
    const querySnapshot = await getDocs(collection(db, 'Finanza'));
    const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFinanzas(datos);
  };

  useEffect(() => {
    leerDatos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Finanzas</Text>
      <FlatList
        data={finanzas}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Nombre: {item.nombre}</Text>
            <Text>Tipo: {item.Tipo}</Text>
            <Text>Monto: {item.Monto.toLocaleString()} Gs.</Text>
            <Text>Fecha: {new Date(item.Fecha.seconds * 1000).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});

export default FirebaseLeer;

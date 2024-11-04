// screens/HistorialScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HistorialScreen = () => {
  const historial = [
    { mes: 'Enero', ingresos: 5000, egresos: 2000 },
    { mes: 'Febrero', ingresos: 5500, egresos: 2200 },
    { mes: 'Marzo', ingresos: 5300, egresos: 2100 },
    // Agrega más registros aquí según necesites
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={historial}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.month}>{item.mes}</Text>
            <Text>Ingresos: ${item.ingresos}</Text>
            <Text>Egresos: ${item.egresos}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 5,
  },
  month: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default HistorialScreen;
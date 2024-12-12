import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { crearProducto, leerProducto, actualizarProducto, eliminarProducto } from '../productos';

const ProductosScreen = () => {
  const [producto, setProducto] = useState(null);

  const manejarLeerProducto = async () => {
    const datos = await leerProducto();
    setProducto(datos);
  };

  const manejarActualizarProducto = async () => {
    const nuevosDatos = { nombre: 'Producto Editado', precio: 25000, cantidad: 15 };
    await actualizarProducto(nuevosDatos);
    manejarLeerProducto(); // Actualiza la vista
  };

  const manejarEliminarProducto = async () => {
    await eliminarProducto();
    setProducto(null); // Limpia el estado
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Producto</Text>
      {producto ? (
        <View>
          <Text>Nombre: {producto.nombre}</Text>
          <Text>Precio: {producto.precio}</Text>
          <Text>Cantidad: {producto.cantidad}</Text>
        </View>
      ) : (
        <Text>No hay producto cargado</Text>
      )}
      <Button title="Leer Producto" onPress={manejarLeerProducto} />
      <Button title="Actualizar Producto" onPress={manejarActualizarProducto} />
      <Button title="Eliminar Producto" onPress={manejarEliminarProducto} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default ProductosScreen;

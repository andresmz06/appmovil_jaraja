import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './credenciales';

// Crear un producto
export const crearProducto = async (producto) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), producto);
    console.log('Producto creado con ID:', docRef.id);
  } catch (error) {
    console.error('Error al crear producto:', error);
  }
};

// Leer un producto específico
export const leerProducto = async () => {
  try {
    const productoRef = doc(db, 'productos', 'producto_1'); // Usamos el ID fijo
    console.log('Intentando obtener producto con ID: producto_1');
    const productoSnap = await getDoc(productoRef);

    if (productoSnap.exists()) {
      console.log('Producto encontrado:', productoSnap.data());
      return productoSnap.data();
    } else {
      console.warn('El producto con ID "producto_1" no existe en Firestore.');
      return null;
    }
  } catch (error) {
    console.error('Error al leer producto:', error);
    return null;
  }
};

// Actualizar un producto específico
export const actualizarProducto = async (nuevosDatos) => {
  try {
    const productoRef = doc(db, 'productos', 'producto_1'); // Usamos el ID fijo
    await updateDoc(productoRef, nuevosDatos);
    console.log('Producto actualizado:', nuevosDatos);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
  }
};

// Eliminar un producto específico
export const eliminarProducto = async () => {
  try {
    const productoRef = doc(db, 'productos', 'producto_1'); // Usamos el ID fijo
    await deleteDoc(productoRef);
    console.log('Producto eliminado');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
};

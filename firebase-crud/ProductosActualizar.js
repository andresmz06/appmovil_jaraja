import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../credenciales';

const actualizarProducto = async (id, nuevosDatos) => {
  try {
    const productoRef = doc(db, 'productos', id);
    await updateDoc(productoRef, nuevosDatos);
    console.log('Producto actualizado');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
  }
};

// Ejemplo de uso:
actualizarProducto('id_del_producto', { precio: 12000, cantidad: 45 });

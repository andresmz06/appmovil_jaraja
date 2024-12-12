import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../credenciales';

const eliminarProducto = async (id) => {
  try {
    const productoRef = doc(db, 'productos', id);
    await deleteDoc(productoRef);
    console.log('Producto eliminado');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
};

// Ejemplo de uso:
eliminarProducto('id_del_producto');

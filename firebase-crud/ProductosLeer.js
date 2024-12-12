import { collection, getDocs } from 'firebase/firestore';
import { db } from '../credenciales';

const leerProductos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    const productos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Productos:', productos);
    return productos;
  } catch (error) {
    console.error('Error al leer productos:', error);
  }
};

// Ejemplo de uso:
leerProductos();

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../credenciales';

const crearProducto = async (producto) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), producto);
    console.log('Producto creado con ID:', docRef.id);
  } catch (error) {
    console.error('Error al crear producto:', error);
  }
};

// Ejemplo de uso:
crearProducto({ nombre: 'Café', precio: 10000, cantidad: 50 });

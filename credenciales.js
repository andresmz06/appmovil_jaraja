// credenciales.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBnBE51v4uqG05ogZ0ERth5bgz4PoVhW8",
  authDomain: "proyectoparcial-f82e6.firebaseapp.com",
  projectId: "proyectoparcial-f82e6",
  storageBucket: "proyectoparcial-f82e6.appspot.com", // Corregido de 'firebasestorage.app' a 'appspot.com'
  messagingSenderId: "159812067592",
  appId: "1:159812067592:web:90c4083b7f92f11dae8cbd"
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export { db, auth };
export default appFirebase;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDrLdmB5ZfVLhCzSLnpjMhls3s6MjPvU18",
  authDomain: "alertas-4c221.firebaseapp.com",
  projectId: "alertas-4c221",
  storageBucket: "alertas-4c221.firebasestorage.app",
  messagingSenderId: "516288459114",
  appId: "1:516288459114:web:822256dbfab55a789a3513",
  measurementId: "G-PBCXGTBMYT"
};

// Inicializa la aplicación de Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa la autenticación de Firebase
export const auth = getAuth(app);

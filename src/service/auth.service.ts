import { Injectable } from '@angular/core';
import { auth } from '../components/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Método para iniciar sesión

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {}

  // Método para iniciar sesión con correo y contraseña
  signInWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario autenticado con correo:', user);

        // Guardar el UID del usuario en localStorage
        localStorage.setItem('uid', user.uid);
        
        // Devolver el usuario para que el componente pueda manejarlo si es necesario
        return user;
      })
      .catch((error) => {
        console.error('Error de autenticación:', error);
        throw error;
      });
  }

  // Puedes agregar otros métodos de autenticación (Google, Facebook, etc.) aquí.
}

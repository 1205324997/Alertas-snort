import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../components/firebase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    // Marcar todos los campos como tocados para activar la validación
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const { email, password, confirmPassword, name, username } = this.registerForm.value;

      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      // Lógica para registrar al usuario en Firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Usuario registrado exitosamente:', user);
          this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
        })
        .catch((error) => {
          console.error('Error al registrar usuario:', error);
          if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'El correo ya está en uso';
          } else if (error.code === 'auth/invalid-email') {
            this.errorMessage = 'Correo inválido';
          } else if (error.code === 'auth/weak-password') {
            this.errorMessage = 'Contraseña débil';
          } else {
            this.errorMessage = 'Error en el registro';
          }
        });
    } else {
      this.errorMessage = 'Formulario inválido';
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService  // Inyección del servicio
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    // Solo navega a home si el formulario es válido
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Formulario válido', { email, password });

      // Redirige a la página de Home
      this.router.navigate(['/home']);
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }

  // Método para navegar a la página de registro
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}

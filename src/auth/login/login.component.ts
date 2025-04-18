import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AuthService],
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService);
  loginErrorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  Inicio(): void {
    this.router.navigate(['/start']); 
  }

  onSubmit(): void {
    this.loginErrorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginErrorMessage = 'Correo o contraseña incorrectos.';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isSubmitting = true;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('Usuario autenticado:', user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.loginErrorMessage = 'Correo o contraseña incorrectos.';
        this.isSubmitting = false;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordMismatch = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.registerForm.valueChanges.subscribe(() => this.checkPasswords());
  }

  checkPasswords(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    this.passwordMismatch = password && confirmPassword && password !== confirmPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passwordMismatch) return;

    const { name, email, password } = this.registerForm.value;

    this.authService.registerPerson(name, '', email, password).subscribe({
      next: () => {
        this.successMessage = '¡Registro exitoso!';
        this.registerForm.reset();
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al registrar. Intenta más tarde.';
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

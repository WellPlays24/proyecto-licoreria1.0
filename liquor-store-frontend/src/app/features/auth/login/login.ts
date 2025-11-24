// ============================================
// COMPONENTE LOGIN
// ============================================

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatCardSubtitle,
    MatCardContent,
    MatFormField,
    MatFormFieldModule,
    MatError,
    MatLabel,
    MatSpinner,
    ReactiveFormsModule,
    NgIf,
    MatInput,
    RouterLink,

  ]
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  loading = false;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Obtener URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Crear formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para validaciones
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Mensaje de error para email
  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'El email es requerido';
    }
    if (this.email?.hasError('email')) {
      return 'Email no válido';
    }
    return '';
  }

  // Mensaje de error para password
  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.password?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  // Submit del formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Usar setTimeout para evitar error NG0100
        setTimeout(() => {
          this.loading = false;
          this.snackBar.open(`¡Bienvenido ${response.user.name}!`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          // Redirigir según el rol
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            // Si hay returnUrl, ir ahí, sino a productos
            const url = this.returnUrl !== '/' ? this.returnUrl : '/products';
            this.router.navigate([url]);
          }
        });
      },
      error: (error) => {
        setTimeout(() => {
          this.loading = false;
          const errorMessage = error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        });
      }
    });
  }
}

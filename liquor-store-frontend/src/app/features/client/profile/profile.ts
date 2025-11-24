import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  // Forms
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  // State
  user: User | null = null;
  loading = false;
  saving = false;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private initForm(): void {
    // Profile form
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
    this.profileForm.disable();

    // Password change form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.passwordForm.disable();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        this.profileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone || '',
          address: this.user.address || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile', error);
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm.enable();
      this.profileForm.get('email')?.disable(); // Email not editable
      this.passwordForm.enable();
    } else {
      this.profileForm.disable();
      this.passwordForm.disable();
      // Restore original profile values
      if (this.user) {
        this.profileForm.patchValue({
          name: this.user.name,
          phone: this.user.phone || '',
          address: this.user.address || ''
        });
      }
      // Reset password form
      this.passwordForm.reset();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Por favor completa los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.saving = true;
    const formValue = this.profileForm.getRawValue();
    this.authService.updateProfile(formValue).subscribe({
      next: (response) => {
        this.user = response.user;
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.editMode = false;
        this.profileForm.disable();
        this.passwordForm.disable();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating profile', error);
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.snackBar.open('Por favor completa los campos de contraseña', 'Cerrar', { duration: 3000 });
      return;
    }
    const pwdData = this.passwordForm.value;
    this.saving = true;
    this.authService.changePassword(pwdData).subscribe({
      next: () => {
        this.snackBar.open('Contraseña cambiada correctamente', 'Cerrar', { duration: 3000 });
        this.passwordForm.reset();
        this.passwordForm.disable();
        this.editMode = false;
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error changing password', error);

        // Usar setTimeout para evitar error NG0100
        setTimeout(() => {
          // Verificar si es error 401 (contraseña incorrecta)
          if (error.status === 401 || error.status === 403) {
            this.snackBar.open('Contraseña anterior incorrecta', 'Aceptar', { duration: 5000 });
          } else {
            // Otros errores
            this.snackBar.open('Error al cambiar la contraseña', 'Cerrar', { duration: 3000 });
          }
          this.saving = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

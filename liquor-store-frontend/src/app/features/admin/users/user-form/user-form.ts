import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    templateUrl: './user-form.html',
    styleUrl: './user-form.css'
})
export class UserForm implements OnInit {
    userForm: FormGroup;
    isEditing = false;
    userId: number | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private cd: ChangeDetectorRef
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''], // Requerido solo en creación
            role: ['cliente', Validators.required],
            phone: [''],
            address: ['']
        });
    }

    ngOnInit(): void {
        this.userId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.userId) {
            this.isEditing = true;
            this.loadUser(this.userId);
        } else {
            // Si es creación, password es requerido
            this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
            this.userForm.get('password')?.updateValueAndValidity();
        }
    }

    loadUser(id: number): void {
        setTimeout(() => {
            this.loading = true;
            this.cd.detectChanges();

            this.userService.getById(id).subscribe({
                next: (response) => {
                    this.userForm.patchValue({
                        name: response.user.name,
                        email: response.user.email,
                        role: response.user.role,
                        phone: response.user.phone,
                        address: response.user.address
                    });
                    this.loading = false;
                    this.cd.detectChanges();
                },
                error: (error) => {
                    console.error('Error al cargar usuario:', error);
                    this.snackBar.open('Error al cargar usuario', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/admin/users']);
                    this.loading = false;
                    this.cd.detectChanges();
                }
            });
        });
    }

    onSubmit(): void {
        if (this.userForm.invalid) {
            return;
        }

        this.loading = true;
        this.cd.detectChanges();

        const userData = this.userForm.value;

        if (this.isEditing && this.userId) {
            // En edición, eliminamos password si está vacío para no sobrescribirlo
            if (!userData.password) {
                delete userData.password;
            }

            this.userService.update(this.userId, userData).subscribe({
                next: () => {
                    this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/admin/users']);
                },
                error: (error) => {
                    console.error('Error al actualizar usuario:', error);
                    this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
                    this.loading = false;
                    this.cd.detectChanges();
                }
            });
        } else {
            this.userService.create(userData).subscribe({
                next: () => {
                    this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/admin/users']);
                },
                error: (error) => {
                    console.error('Error al crear usuario:', error);
                    this.snackBar.open('Error al crear usuario', 'Cerrar', { duration: 3000 });
                    this.loading = false;
                    this.cd.detectChanges();
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/admin/users']);
    }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../../core/services/category';
import { Category } from '../../../../shared/models/category';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getById(id).subscribe({
      next: (response) => {
        this.form.patchValue({
          name: response.category.name,
          description: response.category.description
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category', error);
        this.showSnackBar('Error al cargar la categoría', 'error');
        this.loading = false;
        this.router.navigate(['/admin/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const categoryData = this.form.value;

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, categoryData).subscribe({
        next: () => {
          this.showSnackBar('Categoría actualizada correctamente', 'success');
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Error updating category', error);
          this.showSnackBar('Error al actualizar la categoría', 'error');
          this.loading = false;
        }
      });
    } else {
      this.categoryService.create(categoryData).subscribe({
        next: () => {
          this.showSnackBar('Categoría creada correctamente', 'success');
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Error creating category', error);
          this.showSnackBar('Error al crear la categoría', 'error');
          this.loading = false;
        }
      });
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}

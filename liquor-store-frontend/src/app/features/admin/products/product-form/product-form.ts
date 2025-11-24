import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../../core/services/product';
import { CategoryService } from '../../../../core/services/category';
import { Category } from '../../../../shared/models/category';
import { ProductRequest } from '../../../../shared/models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category_id: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image_url: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.showSnackBar('Error al cargar categorías', 'error');
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (response) => {
        const product = response.product;
        this.form.patchValue({
          name: product.name,
          category_id: product.category_id,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
          active: product.active
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.showSnackBar('Error al cargar el producto', 'error');
        this.loading = false;
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const productData: ProductRequest = this.form.value;

    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, productData).subscribe({
        next: () => {
          this.showSnackBar('Producto actualizado correctamente', 'success');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.showSnackBar('Error al actualizar el producto', 'error');
          this.loading = false;
        }
      });
    } else {
      this.productService.create(productData).subscribe({
        next: () => {
          this.showSnackBar('Producto creado correctamente', 'success');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error creating product', error);
          this.showSnackBar('Error al crear el producto', 'error');
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

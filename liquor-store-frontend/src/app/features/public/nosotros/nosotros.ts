// ============================================
// COMPONENTE NOSOTROS (RF09)
// ============================================

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css',
  imports: [
    MatIcon, MatCard, MatCardContent,
    MatCardHeader, MatCardTitle,
    MatChip,MatChipSet
  ]
})
export class Nosotros {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  goToProducts(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
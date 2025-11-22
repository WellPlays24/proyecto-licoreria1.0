// ============================================
// MÓDULO DE AUTENTICACIÓN
// ============================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing-module';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { Login } from './login/login';
import { Register } from './register/register';

@NgModule({
  declarations: [
    //Login,
    //Register
    // nota: uando un componente es standalone, ya no puede ir en declarations: dentro de un módulo, porque no pertenece a ningún NgModule.
  ],
  imports: [
    Login,
    Register,
    
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class AuthModule { }
# Licorería Online – Frontend (Angular + Angular Material)

Aplicación web desarrollada en Angular, diseñada para la venta online de bebidas alcohólicas.
Incluye autenticación JWT, manejo de roles, carrito persistente, CRUD de productos/categorías para administradores, módulo público, dashboard de clientes y estructura profesional basada en N-capas.

# Tecnologías Principales
    Angular 17+
    Angular Material
    SCSS personalizado
    RXJS – Observables
    Angular Router + Lazy Loading
    JWT Interceptor
    Formularios Reactivos
    Arquitectura modular N-capas
    API REST (NodeJS + PostgreSQL)

# Estructura del Proyecto
    El proyecto sigue una arquitectura profesional:

    src/app/
    │
    ├── core/                  # Lógica central del sistema
    │   ├── guards/            # Guards de rutas
    │   │   ├── auth-guard.ts
    │   │   ├── role-guard.ts
    │   │   └── no-auth-guard.ts
    │   │
    │   ├── interceptors/      # Interceptor JWT
    │   │   └── auth-interceptor.ts
    │   │
    │   ├── services/          # Servicios globales
    │       ├── auth.ts
    │       ├── cart.ts
    │       ├── category.ts
    │       ├── product.ts
    │       ├── order.ts
    │       └── invoice.ts
    │
    ├── features/              # Módulos por áreas del sistema
    │   │
    │   ├── admin/             # Panel administrativo
    │   │   ├── dashboard/
    │   │   ├── categories/
    │   │   ├── products/
    │   │   ├── orders/
    │   │   ├── invoices/
    │   │   ├── admin-module.ts
    │   │   └── admin-routing-module.ts
    │   │
    │   ├── auth/              # Autenticación
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── auth-module.ts
    │   │   └── auth-routing-module.ts
    │   │
    │   ├── client/            # Área de usuario cliente
    │   │   ├── cart/
    │   │   ├── orders/
    │   │   ├── invoices/
    │   │   ├── products/
    │   │   ├── profile/
    │   │   ├── client-module.ts
    │   │   └── client-routing-module.ts
    │   │
    │   ├── public/            # Módulos visibles sin login
    │       ├── home/
    │       ├── nosotros/
    │       ├── public-module.ts
    │       └── public-routing-module.ts
    │
    ├── shared/                # Reutilizable en toda la app
    │   ├── components/
    │   │   ├── navbar/
    │   │   ├── footer/
    │   │   ├── loading-spinner/
    │   │   └── product-card/
    │   │
    │   ├── models/            # Interfaces y tipos
    │   │   ├── product.ts
    │   │   ├── category.ts
    │   │   ├── user.ts
    │   │   ├── order.ts
    │   │   └── invoice.ts
    │   │
    │   └── utils/
    │
    └── app.config.ts          # Configuración general Angular

# UI — Construida con Angular Material
    ✔ mat-toolbar
    ✔ mat-icon
    ✔ mat-card
    ✔ mat-button y mat-raised-button
    ✔ Inputs mat-form-field
    ✔ mat-progress-spinner

    Ejemplo del navbar real de tu proyecto:

    <div class="nav-links" *ngIf="!isAuthenticated">
    <button mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        <mat-icon>home</mat-icon>
        Inicio
    </button>

    <button mat-button routerLink="/nosotros" routerLinkActive="active">
        <mat-icon>info</mat-icon>
        Nosotros
    </button>

    <button mat-raised-button color="accent" routerLink="/login">
        <mat-icon>login</mat-icon>
        Iniciar Sesión
    </button>

    <button mat-button routerLink="/register">
        Registrarse
    </button>
    </div>

# Autenticación & Seguridad
    ✔ Inicio de sesión
    ✔ Registro
    ✔ Roles: admin y client
    ✔ Token JWT
    ✔ Guards implementados

    AuthGuard
    NoAuthGuard
    RoleGuard

    ✔ Interceptor

    auth-interceptor.ts agrega automáticamente el token a cada request.

# Funcionalidades Principales

## Para Administradores
    CRUD de Categorías
    CRUD de Productos
    Gestión de Pedidos
    Gestión de Facturas
    Dashboard administrativo

## Para Clientes
    Ver productos por categorías
    Detalle del producto
    Carrito persistente
    Realizar pedidos
    Ver historial de órdenes
    Ver facturas
    Editar perfil

### Para visitantes (público)
    Home
    Nosotros
    Productos destacados
    Navegación libre

# Configuración del entorno
    Editar:
    src/environments/environment.ts

    export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
    };

# Instalación y ejecución
    git clone https://github.com/usuario/licoreria-frontend.git
    cd licoreria-frontend
    npm install
    ng serve -o

# Screenshots (falta agregar imágenes aqui)
    Home

    ![Home](./screenshots/home.png)

    Productos

    ![Productos](./screenshots/products.png)

    Login

    ![Login](./screenshots/login.png)

    Registro

    ![Register](./screenshots/register.png)

    Panel Admin

    ![Admin](./screenshots/admin.png)

# API Consumida

    Ejemplos:

    POST /auth/login
    POST /auth/register
    GET  /products
    GET  /categories
    POST /cart
    GET  /orders

# Autor
# Ing. Wellington Castillo
# Proyecto académico fullstack basado en Angular + Node + PostgreSQL (2025)
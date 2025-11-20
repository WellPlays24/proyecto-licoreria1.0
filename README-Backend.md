### API REST – Licorería Backend (Node.js + PostgreSQL) ###

# Descripción

Este repositorio contiene el backend de una API REST para una Licorería, desarrollado con Node.js, Express y PostgreSQL.
Incluye módulos completos de:

    Autenticación y autorización con JWT
    Gestión de productos, categorías e imágenes
    Carrito de compras
    Sistema de pedidos
    Generación y consulta de facturas
    Control de roles (admin/cliente)

    El proyecto es académico/personal y no está destinado a producción, pero implementa buenas prácticas de arquitectura y seguridad.


# Tecnologías Principales

Node.js + Express.js
PostgreSQL (pg)
JWT (jsonwebtoken)
bcryptjs para hashing
multer + sharp para manejo de imágenes
dotenv, cors, morgan


# Estructura del Proyecto

/src
 ├── app.js
 ├── server.js
 ├── /config
 │    └── database.js
 ├── /controllers
 │    ├── auth.controller.js
 │    ├── product.controller.js
 │    ├── category.controller.js
 │    ├── cart.controller.js
 │    ├── order.controller.js
 │    └── invoice.controller.js
 ├── /middlewares
 │    ├── auth.middleware.js
 │    ├── validation.middleware.js
 │    └── upload.middleware.js
 ├── /routes
 │    ├── auth.routes.js
 │    ├── product.routes.js
 │    ├── category.routes.js
 │    ├── cart.routes.js
 │    ├── order.routes.js
 │    ├── invoice.routes.js
 │    └── index.js
 └── /uploads
      └── /products


# Instalación y Configuración

    1. Clonar repositorio
        git clone https://github.com/tuusuario/licoreria-backend.git
        cd licoreria-backend

    2. Instalar dependencias
        npm install

    3. Configurar variables de entorno
        Crear archivo .env en la raíz:

        PORT=3000
        JWT_SECRET=tu_secret_key
        DB_HOST=localhost
        DB_USER=postgres
        DB_PASSWORD=tu_password
        DB_NAME=licoreria_db
        DB_PORT=5432
        FRONTEND_URL=http://localhost:4200

    4. Ejecutar servidor
        npm run dev



# Base de Datos

    La base de datos está construida en PostgreSQL y contiene las siguientes tablas:

    users
    products
    categories
    cart_items
    orders
    order_details
    invoices

# Incluye soporte para:
    Relaciones uno-a-muchos
    Generación de pedidos con detalles
    Facturación automática


### Autenticación

    La API usa JWT.
    Agregar el token en cada petición protegida:
    Authorization: Bearer TU_TOKEN_AQUI

# Roles soportados: 

    admin – acceso total
    cliente – acceso limitado


### Rutas Principales

# Auth

| Método | Ruta                 | Descripción       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Registrar usuario |
| POST   | `/api/auth/login`    | Iniciar sesión    |
| GET    | `/api/auth/profile`  | Perfil usuario    |


# Productos

| Método | Ruta                                |
| ------ | ----------------------------------- |
| GET    | `/api/products`                     |
| GET    | `/api/products/:id`                 |
| POST   | `/api/products` *(admin)*           |
| PUT    | `/api/products/:id` *(admin)*       |
| PATCH  | `/api/products/:id/stock` *(admin)* |
| POST   | `/api/products/:id/image` *(admin)* |


# Categorías

| Método | Ruta                            |
| ------ | ------------------------------- |
| GET    | `/api/categories`               |
| POST   | `/api/categories` *(admin)*     |
| PUT    | `/api/categories/:id` *(admin)* |
| DELETE | `/api/categories/:id` *(admin)* |


# Carrito

| Método | Ruta                          |
| ------ | ----------------------------- |
| GET    | `/api/cart`                   |
| POST   | `/api/cart/add`               |
| PUT    | `/api/cart/update/:productId` |
| DELETE | `/api/cart/remove/:productId` |
| DELETE | `/api/cart/clear`             |


# Pedidos

| Método | Ruta                               |
| ------ | ---------------------------------- |
| POST   | `/api/orders/create`               |
| GET    | `/api/orders/my-orders`            |
| GET    | `/api/orders/:id`                  |
| GET    | `/api/orders` *(admin)*            |
| PATCH  | `/api/orders/:id/status` *(admin)* |


# Facturas

| Método | Ruta                        |
| ------ | --------------------------- |
| GET    | `/api/invoices/my-invoices` |
| GET    | `/api/invoices/:id`         |
| GET    | `/api/invoices` *(admin)*   |


# Subida de Imágenes

    Manejo con multer + sharp:

    Se almacenan en /uploads/products
    Convertidas a WEBP
    Tamaño optimizado a 800×800 (máx)

    Ruta: POST /api/products/:id/image


# Testing

    Recomendado usar:

    Postman
    Thunder Client
    Insomnia

    Incluye:

    Pruebas con token
    Flujo completo carrito → pedido → factura
    Módulo de administración


# Autor

Wellington Castillo
Backend desarrollado como proyecto académico y de práctica con Node.js + PostgreSQL.

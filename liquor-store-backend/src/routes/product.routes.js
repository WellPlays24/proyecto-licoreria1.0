// ============================================
// RUTAS DE PRODUCTOS
// ============================================

const express = require('express');
const router = express.Router();

// Importar controladores
const productController = require('../controllers/product.controller');

// Importar middlewares
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { uploadProductImage } = require('../middlewares/upload.middleware');

// ============================================
// RUTAS PÚBLICAS
// ============================================

// GET /api/products - Obtener todos los productos (con filtros opcionales)
router.get('/', productController.getAll);

// GET /api/products/search - Buscar productos (RF02)
router.get('/search', productController.search);

// GET /api/products/category/:categoryId - Productos por categoría (RF02)
router.get('/category/:categoryId', productController.getByCategory);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', productController.getById);

// ============================================
// RUTAS ADMIN (requieren autenticación y rol admin)
// ============================================

// POST /api/products - Crear nuevo producto (RF07)
router.post('/', verifyToken, isAdmin, productController.create);

// PUT /api/products/:id - Actualizar producto (RF07)
router.put('/:id', verifyToken, isAdmin, productController.update);

// PATCH /api/products/:id/stock - Actualizar solo el stock (RF07)
router.patch('/:id/stock', verifyToken, isAdmin, productController.updateStock);

// DELETE /api/products/:id - Eliminar producto (RF07)
router.delete('/:id', verifyToken, isAdmin, productController.delete);

// POST /api/products/:id/image - Subir imagen del producto
router.post(
  '/:id/image',
  verifyToken,
  isAdmin,
  uploadProductImage,
  productController.uploadImage
);

module.exports = router;
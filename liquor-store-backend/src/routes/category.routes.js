// ============================================
// RUTAS DE CATEGORÍAS
// ============================================

const express = require('express');
const router = express.Router();

// Importar controladores
const categoryController = require('../controllers/category.controller');

// Importar middlewares
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// ============================================
// RUTAS PÚBLICAS
// ============================================

// GET /api/categories - Obtener todas las categorías
router.get('/', categoryController.getAll);

// GET /api/categories/:id - Obtener categoría por ID
router.get('/:id', categoryController.getById);

// ============================================
// RUTAS ADMIN (requieren autenticación y rol admin)
// ============================================

// POST /api/categories - Crear nueva categoría
router.post('/', verifyToken, isAdmin, categoryController.create);

// PUT /api/categories/:id - Actualizar categoría
router.put('/:id', verifyToken, isAdmin, categoryController.update);

// DELETE /api/categories/:id - Eliminar categoría
router.delete('/:id', verifyToken, isAdmin, categoryController.delete);

module.exports = router;
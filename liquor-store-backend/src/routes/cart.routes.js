// ============================================
// RUTAS DE CARRITO
// ============================================

const express = require('express');
const router = express.Router();

// Importar controladores
const cartController = require('../controllers/cart.controller');

// Importar middlewares
const { verifyToken } = require('../middlewares/auth.middleware');

// ============================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ============================================

// GET /api/cart - Obtener carrito del usuario autenticado
router.get('/', verifyToken, cartController.getCart);

// POST /api/cart/add - Agregar producto al carrito (RF03, RF04, RF06)
router.post('/add', verifyToken, cartController.addItem);

// PUT /api/cart/update/:productId - Actualizar cantidad de un producto
router.put('/update/:productId', verifyToken, cartController.updateQuantity);

// DELETE /api/cart/remove/:productId - Eliminar producto del carrito (RF06)
router.delete('/remove/:productId', verifyToken, cartController.removeItem);

// DELETE /api/cart/clear - Vaciar todo el carrito
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
// ============================================
// RUTAS DE PEDIDOS
// ============================================

const express = require('express');
const router = express.Router();

// Importar controladores
const orderController = require('../controllers/order.controller');

// Importar middlewares
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// ============================================
// RUTAS DE CLIENTE (requieren autenticación)
// ============================================

// POST /api/orders/create - Crear pedido desde el carrito (RF05, RF06)
router.post('/create', verifyToken, orderController.createFromCart);

// GET /api/orders/my-orders - Obtener pedidos del usuario autenticado
router.get('/my-orders', verifyToken, orderController.getMyOrders);

// GET /api/orders/:id - Obtener detalle de un pedido específico
router.get('/:id', verifyToken, orderController.getById);

// ============================================
// RUTAS ADMIN (requieren autenticación y rol admin)
// ============================================

// GET /api/orders - Obtener todos los pedidos (RF08)
router.get('/', verifyToken, isAdmin, orderController.getAll);

// PATCH /api/orders/:id/status - Actualizar estado del pedido (RF08)
router.patch('/:id/status', verifyToken, isAdmin, orderController.updateStatus);

module.exports = router;
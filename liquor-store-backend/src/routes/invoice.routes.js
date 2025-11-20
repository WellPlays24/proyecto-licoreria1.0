// ============================================
// RUTAS DE FACTURAS
// ============================================

const express = require('express');
const router = express.Router();

// Importar controladores
const invoiceController = require('../controllers/invoice.controller');

// Importar middlewares
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// ============================================
// RUTAS DE CLIENTE (requieren autenticación)
// ============================================

// GET /api/invoices/my-invoices - Obtener facturas del usuario (RF12)
router.get('/my-invoices', verifyToken, invoiceController.getMyInvoices);

// GET /api/invoices/:id - Obtener factura específica (RF12)
router.get('/:id', verifyToken, invoiceController.getById);

// GET /api/invoices/order/:orderId - Obtener factura por ID de pedido
router.get('/order/:orderId', verifyToken, invoiceController.getByOrderId);

// ============================================
// RUTAS ADMIN (requieren autenticación y rol admin)
// ============================================

// GET /api/invoices - Obtener todas las facturas (RF12)
router.get('/', verifyToken, isAdmin, invoiceController.getAll);

module.exports = router;
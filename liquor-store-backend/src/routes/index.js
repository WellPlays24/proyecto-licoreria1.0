// ============================================
// CENTRALIZADOR DE RUTAS
// ============================================

const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const invoiceRoutes = require('./invoice.routes');
const userRoutes = require('./user.routes');

// ============================================
// ASIGNAR RUTAS A SUS PREFIJOS
// ============================================

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/users', userRoutes);

// ============================================
// RUTA DE INFORMACIÓN DE LA API
// ============================================

router.get('/', (req, res) => {
  res.json({
    message: 'API Licorería v1.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      invoices: '/api/invoices',
      users: '/api/users',
      
    }
  });
});

module.exports = router;
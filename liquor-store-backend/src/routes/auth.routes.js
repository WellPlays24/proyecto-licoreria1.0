// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

const express = require('express');
const router = express.Router();

// Importar controladores
const authController = require('../controllers/auth.controller');

// Importar middlewares
const { verifyToken } = require('../middlewares/auth.middleware');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', verifyToken, authController.getProfile);

// PUT /api/auth/profile - Actualizar perfil
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
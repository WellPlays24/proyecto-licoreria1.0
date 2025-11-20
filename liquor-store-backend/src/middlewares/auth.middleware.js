// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

// ============================================
// VERIFICAR TOKEN JWT
// ============================================

const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Acceso denegado',
        message: 'No se proporcionó token de autenticación'
      });
    }

    // El formato esperado es: "Bearer TOKEN"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Acceso denegado',
        message: 'Token inválido'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar datos del usuario al request para usarlo en los controladores
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'La sesión ha expirado, por favor inicia sesión nuevamente'
      });
    }

    return res.status(500).json({
      error: 'Error de autenticación',
      message: 'Error al verificar el token'
    });
  }
};

// ============================================
// VERIFICAR ROL DE ADMINISTRADOR
// ============================================

const isAdmin = (req, res, next) => {
  try {
    // Este middleware debe usarse DESPUÉS de verifyToken
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debe autenticarse primero'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tiene permisos de administrador'
      });
    }

    next();
  } catch (error) {
    console.error('Error al verificar rol:', error.message);
    return res.status(500).json({
      error: 'Error de autorización',
      message: 'Error al verificar permisos'
    });
  }
};

// ============================================
// VERIFICAR ROL DE CLIENTE
// ============================================

const isClient = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debe autenticarse primero'
      });
    }

    if (req.user.role !== 'cliente') {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'Esta acción solo está disponible para clientes'
      });
    }

    next();
  } catch (error) {
    console.error('Error al verificar rol:', error.message);
    return res.status(500).json({
      error: 'Error de autorización',
      message: 'Error al verificar permisos'
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isClient
};
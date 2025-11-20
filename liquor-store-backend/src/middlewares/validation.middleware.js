// ============================================
// MIDDLEWARE DE VALIDACIONES
// ============================================

// ============================================
// VALIDAR REGISTRO DE USUARIO
// ============================================

const validateRegister = (req, res, next) => {
  const { name, email, password, phone, address } = req.body;
  const errors = [];

  // Validar nombre
  if (!name || name.trim().length === 0) {
    errors.push('El nombre es requerido');
  } else if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('El email no es válido');
  }

  // Validar password
  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  // Validar teléfono (opcional pero debe tener formato válido si se envía)
  if (phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      errors.push('El teléfono debe tener 10 dígitos');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Errores de validación',
      messages: errors
    });
  }

  next();
};

// ============================================
// VALIDAR LOGIN
// ============================================

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('El email es requerido');
  }

  if (!password) {
    errors.push('La contraseña es requerida');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Errores de validación',
      messages: errors
    });
  }

  next();
};

// ============================================
// VALIDAR PRODUCTO
// ============================================

const validateProduct = (req, res, next) => {
  const { category_id, name, price, stock } = req.body;
  const errors = [];

  // Validar categoría
  if (!category_id || isNaN(category_id)) {
    errors.push('La categoría es requerida y debe ser un número');
  }

  // Validar nombre
  if (!name || name.trim().length === 0) {
    errors.push('El nombre del producto es requerido');
  } else if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }

  // Validar precio
  if (price === undefined || price === null) {
    errors.push('El precio es requerido');
  } else if (isNaN(price) || parseFloat(price) < 0) {
    errors.push('El precio debe ser un número positivo');
  }

  // Validar stock
  if (stock === undefined || stock === null) {
    errors.push('El stock es requerido');
  } else if (isNaN(stock) || parseInt(stock) < 0) {
    errors.push('El stock debe ser un número entero positivo o cero');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Errores de validación',
      messages: errors
    });
  }

  next();
};

// ============================================
// VALIDAR CATEGORÍA
// ============================================

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('El nombre de la categoría es requerido');
  } else if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Errores de validación',
      messages: errors
    });
  }

  next();
};

// ============================================
// VALIDAR ITEM DE CARRITO
// ============================================

const validateCartItem = (req, res, next) => {
  const { product_id, quantity } = req.body;
  const errors = [];

  if (!product_id || isNaN(product_id)) {
    errors.push('El ID del producto es requerido y debe ser un número');
  }

  if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
    errors.push('La cantidad debe ser un número entero mayor a cero');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Errores de validación',
      messages: errors
    });
  }

  next();
};

// ============================================
// VALIDAR ACTUALIZACIÓN DE STOCK
// ============================================

const validateStock = (req, res, next) => {
  const { stock } = req.body;
  const errors = [];

  if (stock === undefined || stock === null) {
    errors.push('El stock es requerido');
  } else if (isNaN(stock) || parseInt(stock) < 0) {
    errors.push('El stock debe ser un número entero positivo o cero');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Errores de validación',
      messages: errors
    });
  }

  next();
};

// ============================================
// VALIDAR ACTUALIZACIÓN DE ESTADO DE PEDIDO
// ============================================

const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

  if (!status) {
    return res.status(400).json({
      error: 'El estado es requerido'
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Estado inválido',
      message: `Los estados válidos son: ${validStatuses.join(', ')}`
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateCategory,
  validateCartItem,
  validateStock,
  validateOrderStatus
};
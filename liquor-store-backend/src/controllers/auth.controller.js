// ============================================
// CONTROLADOR DE AUTENTICACIÓN
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
require('dotenv').config();

// ============================================
// REGISTRAR NUEVO USUARIO (RF01)
// ============================================

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role = 'cliente' } = req.body;

    // Verificar si el email ya existe
    const emailExists = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        error: 'Email ya registrado',
        message: 'Ya existe un usuario con este email'
      });
    }

    // Hashear password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario
    const result = await query(
      `INSERT INTO users (name, email, password, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, phone, address, created_at`,
      [name, email, hashedPassword, role, phone, address]
    );

    const user = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      },
      token
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      error: 'Error al registrar usuario',
      message: error.message
    });
  }
};

// ============================================
// INICIAR SESIÓN (RF01)
// ============================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("➡️ BODY RECIBIDO:", req.body);


    // Buscar usuario por email
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    const user = result.rows[0];

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error al iniciar sesión',
      message: error.message
    });
  }
};

// ============================================
// OBTENER PERFIL DEL USUARIO AUTENTICADO
// ============================================

const getProfile = async (req, res) => {
  try {
    // req.user viene del middleware verifyToken
    const userId = req.user.id;

    const result = await query(
      'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      error: 'Error al obtener perfil',
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR PERFIL DEL USUARIO
// ============================================

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    // Construir query dinámicamente solo con campos enviados
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (name) {
      updates.push(`name = $${paramCounter}`);
      values.push(name);
      paramCounter++;
    }

    if (phone) {
      updates.push(`phone = $${paramCounter}`);
      values.push(phone);
      paramCounter++;
    }

    if (address !== undefined) { // Permitir vaciar el campo
      updates.push(`address = $${paramCounter}`);
      values.push(address);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(userId);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCounter}
       RETURNING id, name, email, role, phone, address, updated_at`,
      values
    );

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({
      error: 'Error al actualizar perfil',
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
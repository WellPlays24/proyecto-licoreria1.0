const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
// Obtener todos los usuarios
const getAll = async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, phone, address, created_at FROM users ORDER BY id ASC');
    res.json({ users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};
// Obtener un usuario
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};
// Crear usuario (Admin)
const create = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    
    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await query(
      `INSERT INTO users (name, email, password, role, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role, phone, address`,
      [name, email, hashedPassword, role, phone, address]
    );
    
    res.status(201).json({ message: 'Usuario creado', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};
// Actualizar usuario
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address } = req.body;
    
    // Query dinámica simple para este ejemplo
    // Nota: En producción idealmente usarías una construcción dinámica más robusta
    const result = await query(
      `UPDATE users SET name=$1, email=$2, role=$3, phone=$4, address=$5, updated_at=NOW() 
       WHERE id=$6 RETURNING *`,
      [name, email, role, phone, address, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
// Eliminar usuario
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
module.exports = { getAll, getById, create, update, remove };
// ============================================
// CONTROLADOR DE CATEGORÍAS
// ============================================

const { query } = require('../config/database');

// ============================================
// OBTENER TODAS LAS CATEGORÍAS (RF02)
// ============================================

const getAll = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    
    res.json({
      categories: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error en getAll categories:', error);
    res.status(500).json({
      error: 'Error al obtener categorías',
      message: error.message
    });
  }
};

// ============================================
// OBTENER CATEGORÍA POR ID
// ============================================

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Categoría no encontrada'
      });
    }

    res.json({
      category: result.rows[0]
    });

  } catch (error) {
    console.error('Error en getById category:', error);
    res.status(500).json({
      error: 'Error al obtener categoría',
      message: error.message
    });
  }
};

// ============================================
// CREAR NUEVA CATEGORÍA (RF07 - Admin)
// ============================================

const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar si ya existe una categoría con ese nombre
    const exists = await query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
      [name]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        error: 'Categoría ya existe',
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const result = await query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      category: result.rows[0]
    });

  } catch (error) {
    console.error('Error en create category:', error);
    res.status(500).json({
      error: 'Error al crear categoría',
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR CATEGORÍA (RF07 - Admin)
// ============================================

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Verificar si la categoría existe
    const exists = await query(
      'SELECT id FROM categories WHERE id = $1',
      [id]
    );

    if (exists.rows.length === 0) {
      return res.status(404).json({
        error: 'Categoría no encontrada'
      });
    }

    // Verificar si el nuevo nombre ya existe en otra categoría
    if (name) {
      const nameExists = await query(
        'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2',
        [name, id]
      );

      if (nameExists.rows.length > 0) {
        return res.status(400).json({
          error: 'Nombre de categoría ya existe',
          message: 'Ya existe otra categoría con ese nombre'
        });
      }
    }

    // Construir query dinámicamente
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (name) {
      updates.push(`name = $${paramCounter}`);
      values.push(name);
      paramCounter++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCounter}`);
      values.push(description);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    const result = await query(
      `UPDATE categories 
       SET ${updates.join(', ')}
       WHERE id = $${paramCounter}
       RETURNING *`,
      values
    );

    res.json({
      message: 'Categoría actualizada exitosamente',
      category: result.rows[0]
    });

  } catch (error) {
    console.error('Error en update category:', error);
    res.status(500).json({
      error: 'Error al actualizar categoría',
      message: error.message
    });
  }
};

// ============================================
// ELIMINAR CATEGORÍA (RF07 - Admin)
// ============================================

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existen productos con esta categoría
    const hasProducts = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id]
    );

    if (parseInt(hasProducts.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar',
        message: 'Existen productos asociados a esta categoría. Elimine o reasigne los productos primero.'
      });
    }

    const result = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Categoría no encontrada'
      });
    }

    res.json({
      message: 'Categoría eliminada exitosamente',
      category: result.rows[0]
    });

  } catch (error) {
    console.error('Error en delete category:', error);
    res.status(500).json({
      error: 'Error al eliminar categoría',
      message: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteCategory
};
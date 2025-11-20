// ============================================
// CONTROLADOR DE PRODUCTOS
// ============================================

const { query } = require('../config/database');
const { deleteImage } = require('../middlewares/upload.middleware');

// ============================================
// OBTENER TODOS LOS PRODUCTOS (RF02)
// ============================================

const getAll = async (req, res) => {
  try {
    const { active } = req.query;

    let queryText = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    
    const queryParams = [];

    // Filtrar por activos si se especifica
    if (active !== undefined) {
      queryText += ' WHERE p.active = $1';
      queryParams.push(active === 'true');
    }

    queryText += ' ORDER BY p.created_at DESC';

    const result = await query(queryText, queryParams);

    res.json({
      products: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error en getAll products:', error);
    res.status(500).json({
      error: 'Error al obtener productos',
      message: error.message
    });
  }
};

// ============================================
// BUSCAR PRODUCTOS (RF02)
// ============================================

const search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Parámetro de búsqueda requerido',
        message: 'Proporcione el parámetro "q" para buscar'
      });
    }

    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.active = true 
       AND (LOWER(p.name) LIKE LOWER($1) OR LOWER(p.description) LIKE LOWER($1))
       ORDER BY p.name ASC`,
      [`%${q}%`]
    );

    res.json({
      products: result.rows,
      total: result.rows.length,
      query: q
    });

  } catch (error) {
    console.error('Error en search products:', error);
    res.status(500).json({
      error: 'Error al buscar productos',
      message: error.message
    });
  }
};

// ============================================
// OBTENER PRODUCTOS POR CATEGORÍA (RF02)
// ============================================

const getByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = $1 AND p.active = true
       ORDER BY p.name ASC`,
      [categoryId]
    );

    res.json({
      products: result.rows,
      total: result.rows.length,
      categoryId: parseInt(categoryId)
    });

  } catch (error) {
    console.error('Error en getByCategory products:', error);
    res.status(500).json({
      error: 'Error al obtener productos por categoría',
      message: error.message
    });
  }
};

// ============================================
// OBTENER PRODUCTO POR ID
// ============================================

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json({
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error en getById product:', error);
    res.status(500).json({
      error: 'Error al obtener producto',
      message: error.message
    });
  }
};

// ============================================
// CREAR PRODUCTO (RF07 - Admin)
// ============================================

const create = async (req, res) => {
  try {
    const { category_id, name, description, price, stock, image_url, active = true } = req.body;

    const result = await query(
      `INSERT INTO products (category_id, name, description, price, stock, image_url, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [category_id, name, description, price, stock, image_url, active]
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error en create product:', error);
    res.status(500).json({
      error: 'Error al crear producto',
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR PRODUCTO (RF07 - Admin)
// ============================================

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, stock, image_url, active } = req.body;

    // Verificar si existe
    const exists = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Construir query dinámicamente
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (category_id) {
      updates.push(`category_id = $${paramCounter}`);
      values.push(category_id);
      paramCounter++;
    }

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

    if (price !== undefined) {
      updates.push(`price = $${paramCounter}`);
      values.push(price);
      paramCounter++;
    }

    if (stock !== undefined) {
      updates.push(`stock = $${paramCounter}`);
      values.push(stock);
      paramCounter++;
    }

    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCounter}`);
      values.push(image_url);
      paramCounter++;
    }

    if (active !== undefined) {
      updates.push(`active = $${paramCounter}`);
      values.push(active);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No se proporcionaron campos para actualizar'
      });
    }

    values.push(id);

    const result = await query(
      `UPDATE products 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCounter}
       RETURNING *`,
      values
    );

    res.json({
      message: 'Producto actualizado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error en update product:', error);
    res.status(500).json({
      error: 'Error al actualizar producto',
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR STOCK (RF07 - Admin)
// ============================================

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const result = await query(
      `UPDATE products 
       SET stock = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json({
      message: 'Stock actualizado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateStock:', error);
    res.status(500).json({
      error: 'Error al actualizar stock',
      message: error.message
    });
  }
};

// ============================================
// ELIMINAR PRODUCTO (RF07 - Admin)
// ============================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener imagen antes de eliminar
    const productData = await query('SELECT image_url FROM products WHERE id = $1', [id]);
    
    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Eliminar imagen si existe
    if (productData.rows[0]?.image_url) {
      deleteImage(productData.rows[0].image_url);
    }

    res.json({
      message: 'Producto eliminado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error en delete product:', error);
    res.status(500).json({
      error: 'Error al eliminar producto',
      message: error.message
    });
  }
};

// ============================================
// SUBIR IMAGEN DE PRODUCTO (Admin)
// ============================================

const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.imageInfo) {
      return res.status(400).json({
        error: 'No se procesó ninguna imagen'
      });
    }

    // Obtener imagen anterior
    const oldProduct = await query('SELECT image_url FROM products WHERE id = $1', [id]);
    
    if (oldProduct.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Actualizar con nueva imagen
    const result = await query(
      `UPDATE products 
       SET image_url = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [req.imageInfo.path, id]
    );

    // Eliminar imagen anterior si existe
    if (oldProduct.rows[0].image_url) {
      deleteImage(oldProduct.rows[0].image_url);
    }

    res.json({
      message: 'Imagen subida exitosamente',
      product: result.rows[0],
      imageInfo: req.imageInfo
    });

  } catch (error) {
    console.error('Error en uploadImage:', error);
    res.status(500).json({
      error: 'Error al subir imagen',
      message: error.message
    });
  }
};

module.exports = {
  getAll,
  search,
  getByCategory,
  getById,
  create,
  update,
  updateStock,
  delete: deleteProduct,
  uploadImage
};
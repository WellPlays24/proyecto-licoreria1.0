// ============================================
// CONTROLADOR DE CARRITO
// ============================================

const { query } = require('../config/database');

// ============================================
// OBTENER CARRITO DEL USUARIO
// ============================================

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.added_at,
        p.name as product_name,
        p.price,
        p.stock,
        p.image_url,
        p.active,
        (ci.quantity * p.price) as subtotal
       FROM cart_items ci
       INNER JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.added_at DESC`,
      [userId]
    );

    // Calcular total
    const total = result.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({
      cart: result.rows,
      total: total.toFixed(2),
      items_count: result.rows.length
    });

  } catch (error) {
    console.error('Error en getCart:', error);
    res.status(500).json({
      error: 'Error al obtener carrito',
      message: error.message
    });
  }
};

// ============================================
// AGREGAR PRODUCTO AL CARRITO (RF03, RF04, RF06)
// ============================================

const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Verificar que el producto existe y está activo
    const productResult = await query(
      'SELECT id, name, stock, active FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    const product = productResult.rows[0];

    if (!product.active) {
      return res.status(400).json({
        error: 'Producto no disponible',
        message: 'Este producto no está disponible actualmente'
      });
    }

    // RF04: Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({
        error: 'Producto no disponible por falta de stock',
        message: `Solo hay ${product.stock} unidades disponibles`,
        available_stock: product.stock
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    let result;

    if (existingItem.rows.length > 0) {
      // Si ya existe, actualizar cantidad
      const newQuantity = existingItem.rows[0].quantity + quantity;

      // Verificar stock para la nueva cantidad
      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: 'Producto no disponible por falta de stock',
          message: `Solo hay ${product.stock} unidades disponibles. Ya tienes ${existingItem.rows[0].quantity} en el carrito`,
          available_stock: product.stock,
          current_in_cart: existingItem.rows[0].quantity
        });
      }

      result = await query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Si no existe, agregar nuevo item
      result = await query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, product_id, quantity]
      );
    }

    res.status(201).json({
      message: 'Producto agregado al carrito',
      cart_item: result.rows[0]
    });

  } catch (error) {
    console.error('Error en addItem:', error);
    res.status(500).json({
      error: 'Error al agregar al carrito',
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR CANTIDAD DE UN PRODUCTO
// ============================================

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        error: 'Cantidad inválida',
        message: 'La cantidad debe ser mayor a 0'
      });
    }

    // Verificar stock disponible
    const productResult = await query(
      'SELECT stock FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({
        error: 'Producto no disponible por falta de stock',
        message: `Solo hay ${product.stock} unidades disponibles`,
        available_stock: product.stock
      });
    }

    // Actualizar cantidad
    const result = await query(
      `UPDATE cart_items 
       SET quantity = $1 
       WHERE user_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado en el carrito'
      });
    }

    res.json({
      message: 'Cantidad actualizada',
      cart_item: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateQuantity:', error);
    res.status(500).json({
      error: 'Error al actualizar cantidad',
      message: error.message
    });
  }
};

// ============================================
// ELIMINAR PRODUCTO DEL CARRITO (RF06)
// ============================================

const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado en el carrito'
      });
    }

    res.json({
      message: 'Producto eliminado del carrito',
      cart_item: result.rows[0]
    });

  } catch (error) {
    console.error('Error en removeItem:', error);
    res.status(500).json({
      error: 'Error al eliminar del carrito',
      message: error.message
    });
  }
};

// ============================================
// VACIAR TODO EL CARRITO
// ============================================

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'DELETE FROM cart_items WHERE user_id = $1 RETURNING *',
      [userId]
    );

    res.json({
      message: 'Carrito vaciado',
      items_deleted: result.rows.length
    });

  } catch (error) {
    console.error('Error en clearCart:', error);
    res.status(500).json({
      error: 'Error al vaciar carrito',
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart
};
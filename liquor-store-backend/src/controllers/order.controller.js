// ============================================
// CONTROLADOR DE PEDIDOS
// ============================================

const { query, getClient } = require('../config/database');

// ============================================
// CREAR PEDIDO DESDE CARRITO (RF05, RF06)
// ============================================

const createFromCart = async (req, res) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const userId = req.user.id;

    // 1. Obtener items del carrito con información del producto
    const cartItems = await client.query(
      `SELECT 
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        p.stock
       FROM cart_items ci
       INNER JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1 AND p.active = true`,
      [userId]
    );

    if (cartItems.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Carrito vacío',
        message: 'No hay productos en el carrito para crear un pedido'
      });
    }

    // 2. Verificar stock de todos los productos (RF03, RF04)
    for (const item of cartItems.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'Producto no disponible por falta de stock',
          message: `El producto "${item.name}" no tiene suficiente stock. Disponible: ${item.stock}, Solicitado: ${item.quantity}`,
          product: item.name,
          available_stock: item.stock,
          requested_quantity: item.quantity
        });
      }
    }

    // 3. Calcular total del pedido
    const total = cartItems.rows.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity),
      0
    );

    // 4. Crear el pedido
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES ($1, $2, 'pendiente')
       RETURNING *`,
      [userId, total.toFixed(2)]
    );

    const order = orderResult.rows[0];

    // 5. Crear detalles del pedido y actualizar stock (RF05)
    for (const item of cartItems.rows) {
      // Insertar detalle
      await client.query(
        `INSERT INTO order_details (order_id, product_id, product_name, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.product_id,
          item.name,
          item.quantity,
          item.price,
          (parseFloat(item.price) * item.quantity).toFixed(2)
        ]
      );

      // RF05: Actualizar stock automáticamente
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 6. Obtener datos del usuario para la factura
    const userResult = await client.query(
      'SELECT name, email, phone, address FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    // 7. Generar número de factura único (RF10)
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(order.id).padStart(6, '0')}`;

    // 8. Crear factura (RF10, RF11)
    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        order_id, 
        invoice_number, 
        customer_name, 
        customer_email, 
        customer_phone, 
        customer_address, 
        total
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        order.id,
        invoiceNumber,
        user.name,
        user.email,
        user.phone,
        user.address,
        total.toFixed(2)
      ]
    );

    const invoice = invoiceResult.rows[0];

    // 9. Vaciar el carrito del usuario
    await client.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [userId]
    );

    await client.query('COMMIT');

    // Obtener los detalles completos del pedido
    const orderDetails = await query(
      'SELECT * FROM order_details WHERE order_id = $1',
      [order.id]
    );

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order: {
        ...order,
        details: orderDetails.rows
      },
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        issued_at: invoice.issued_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en createFromCart:', error);
    res.status(500).json({
      error: 'Error al crear pedido',
      message: error.message
    });
  } finally {
    client.release();
  }
};

// ============================================
// OBTENER PEDIDOS DEL USUARIO
// ============================================

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    // Obtener detalles de cada pedido
    const ordersWithDetails = await Promise.all(
      result.rows.map(async (order) => {
        const details = await query(
          'SELECT * FROM order_details WHERE order_id = $1',
          [order.id]
        );
        return {
          ...order,
          details: details.rows
        };
      })
    );

    res.json({
      orders: ordersWithDetails,
      total: ordersWithDetails.length
    });

  } catch (error) {
    console.error('Error en getMyOrders:', error);
    res.status(500).json({
      error: 'Error al obtener pedidos',
      message: error.message
    });
  }
};

// ============================================
// OBTENER PEDIDO POR ID
// ============================================

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Si no es admin, solo puede ver sus propios pedidos
    let queryText = 'SELECT * FROM orders WHERE id = $1';
    let queryParams = [id];

    if (userRole !== 'admin') {
      queryText += ' AND user_id = $2';
      queryParams.push(userId);
    }

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pedido no encontrado'
      });
    }

    const order = result.rows[0];

    // Obtener detalles del pedido
    const details = await query(
      'SELECT * FROM order_details WHERE order_id = $1',
      [id]
    );

    res.json({
      order: {
        ...order,
        details: details.rows
      }
    });

  } catch (error) {
    console.error('Error en getById order:', error);
    res.status(500).json({
      error: 'Error al obtener pedido',
      message: error.message
    });
  }
};

// ============================================
// OBTENER TODOS LOS PEDIDOS (RF08 - Admin)
// ============================================

const getAll = async (req, res) => {
  try {
    const { status } = req.query;

    let queryText = `
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
    `;

    const queryParams = [];

    if (status) {
      queryText += ' WHERE o.status = $1';
      queryParams.push(status);
    }

    queryText += ' ORDER BY o.created_at DESC';

    const result = await query(queryText, queryParams);

    res.json({
      orders: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error en getAll orders:', error);
    res.status(500).json({
      error: 'Error al obtener pedidos',
      message: error.message
    });
  }
};

// ============================================
// ACTUALIZAR ESTADO DEL PEDIDO (RF08 - Admin)
// ============================================

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Pedido no encontrado'
      });
    }

    res.json({
      message: 'Estado del pedido actualizado',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateStatus:', error);
    res.status(500).json({
      error: 'Error al actualizar estado',
      message: error.message
    });
  }
};

// ============================================
// ELIMINAR PEDIDO (Admin)
// ============================================

const deleteOrder = async (req, res) => {
  const client = await getClient();

  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // 1. Verificar si el pedido existe y obtener sus detalles
    // Necesitamos los detalles para devolver el stock
    const orderExists = await client.query(
      'SELECT id FROM orders WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (orderExists.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Pedido no encontrado'
      });
    }

    const orderDetails = await client.query(
      'SELECT product_id, quantity FROM order_details WHERE order_id = $1',
      [id]
    );

    // 2. Devolver productos al stock
    for (const item of orderDetails.rows) {
      await client.query(
        'UPDATE products SET stock = stock + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 3. Eliminar facturas asociadas (si existen)
    await client.query(
      'DELETE FROM invoices WHERE order_id = $1',
      [id]
    );

    // 4. Eliminar detalles del pedido
    await client.query(
      'DELETE FROM order_details WHERE order_id = $1',
      [id]
    );

    // 5. Eliminar el pedido
    await client.query(
      'DELETE FROM orders WHERE id = $1',
      [id]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Pedido eliminado y stock restaurado correctamente',
      orderId: id
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en deleteOrder:', error);
    res.status(500).json({
      error: 'Error al eliminar pedido',
      message: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createFromCart,
  getMyOrders,
  getById,
  getAll,
  updateStatus,
  deleteOrder
};
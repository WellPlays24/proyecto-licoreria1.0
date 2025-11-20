// ============================================
// CONTROLADOR DE FACTURAS
// ============================================

const { query } = require('../config/database');

// ============================================
// OBTENER FACTURAS DEL USUARIO (RF12)
// ============================================

const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
        i.*,
        o.status as order_status
       FROM invoices i
       INNER JOIN orders o ON i.order_id = o.id
       WHERE o.user_id = $1
       ORDER BY i.issued_at DESC`,
      [userId]
    );

    res.json({
      invoices: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error en getMyInvoices:', error);
    res.status(500).json({
      error: 'Error al obtener facturas',
      message: error.message
    });
  }
};

// ============================================
// OBTENER FACTURA POR ID (RF12)
// ============================================

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Obtener factura con información del pedido
    let queryText = `
      SELECT 
        i.*,
        o.status as order_status,
        o.created_at as order_date,
        o.user_id
      FROM invoices i
      INNER JOIN orders o ON i.order_id = o.id
      WHERE i.id = $1
    `;
    
    const queryParams = [id];

    // Si no es admin, verificar que sea su factura
    if (userRole !== 'admin') {
      queryText += ' AND o.user_id = $2';
      queryParams.push(userId);
    }

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Factura no encontrada'
      });
    }

    const invoice = result.rows[0];

    // Obtener detalles del pedido (RF11)
    const details = await query(
      'SELECT * FROM order_details WHERE order_id = $1',
      [invoice.order_id]
    );

    res.json({
      invoice: {
        ...invoice,
        details: details.rows
      }
    });

  } catch (error) {
    console.error('Error en getById invoice:', error);
    res.status(500).json({
      error: 'Error al obtener factura',
      message: error.message
    });
  }
};

// ============================================
// OBTENER FACTURA POR ORDER_ID
// ============================================

const getByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Verificar que el pedido pertenezca al usuario (si no es admin)
    if (userRole !== 'admin') {
      const orderCheck = await query(
        'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
        [orderId, userId]
      );

      if (orderCheck.rows.length === 0) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }
    }

    // Obtener factura
    const result = await query(
      `SELECT 
        i.*,
        o.status as order_status,
        o.created_at as order_date
       FROM invoices i
       INNER JOIN orders o ON i.order_id = o.id
       WHERE i.order_id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Factura no encontrada para este pedido'
      });
    }

    const invoice = result.rows[0];

    // Obtener detalles del pedido
    const details = await query(
      'SELECT * FROM order_details WHERE order_id = $1',
      [orderId]
    );

    res.json({
      invoice: {
        ...invoice,
        details: details.rows
      }
    });

  } catch (error) {
    console.error('Error en getByOrderId:', error);
    res.status(500).json({
      error: 'Error al obtener factura',
      message: error.message
    });
  }
};

// ============================================
// OBTENER TODAS LAS FACTURAS (RF12 - Admin)
// ============================================

const getAll = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        i.*,
        o.status as order_status,
        o.user_id
       FROM invoices i
       INNER JOIN orders o ON i.order_id = o.id
       ORDER BY i.issued_at DESC`
    );

    res.json({
      invoices: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error en getAll invoices:', error);
    res.status(500).json({
      error: 'Error al obtener facturas',
      message: error.message
    });
  }
};

module.exports = {
  getMyInvoices,
  getById,
  getByOrderId,
  getAll
};
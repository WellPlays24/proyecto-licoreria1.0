// ============================================
// MODELO DE PEDIDO
// ============================================

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  created_at: string;
  updated_at: string;
  details?: OrderDetail[];
  customer_name?: string;
  customer_email?: string;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
  invoice: {
    id: number;
    invoice_number: string;
    issued_at: string;
  };
}

export interface UpdateStatusRequest {
  status: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
}
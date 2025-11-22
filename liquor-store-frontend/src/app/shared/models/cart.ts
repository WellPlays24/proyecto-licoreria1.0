// ============================================
// MODELO DE CARRITO
// ============================================

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  stock: number;
  image_url?: string;
  active: boolean;
  subtotal: number;
  added_at: string;
}

export interface CartResponse {
  cart: CartItem[];
  total: string;
  items_count: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}
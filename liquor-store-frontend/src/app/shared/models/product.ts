// ============================================
// MODELO DE PRODUCTO
// ============================================

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
}

export interface ProductRequest {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  active?: boolean;
}
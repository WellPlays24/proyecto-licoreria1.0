// ============================================
// MODELO DE FACTURA
// ============================================

import { OrderDetail } from './order';

export interface Invoice {
  id: number;
  order_id: number;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  total: number;
  issued_at: string;
  order_status?: string;
  order_date?: string;
  details?: OrderDetail[];
}

export interface InvoiceResponse {
  invoices: Invoice[];
  total: number;
}
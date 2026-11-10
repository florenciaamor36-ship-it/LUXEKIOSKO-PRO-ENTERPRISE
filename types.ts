
export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: string;
  barcode: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  timestamp: Date;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  registerId: string;
}

export interface RegisterSession {
  id: string;
  name: string;
  cart: SaleItem[];
  balance: number; // Money currently in this register's drawer
}

export enum AppView {
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  POS = 'pos',
  SALES = 'sales',
  AI_INSIGHTS = 'ai_insights'
}

export interface Category {
  id: string;
  name: string;
}

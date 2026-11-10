export interface Product { id:string; name:string; price:number; cost:number; stock:number; minStock:number; category:string; barcode:string; }
export interface SaleItem { productId:string; name:string; quantity:number; price:number; total:number; }
export interface Sale { id:string; timestamp:Date; items:SaleItem[]; total:number; paymentMethod:'cash'|'card'|'transfer'; registerId:string; status?:'completed'|'voided'; voidReason?:string; }
export interface RegisterSession { id:string; name:string; cart:SaleItem[]; balance:number; isOpen?:boolean; openingAmount?:number; openedAt?:string; }
export interface Supplier { id:string; name:string; phone:string; email:string; notes:string; }
export interface Purchase { id:string; supplierId:string; timestamp:Date; items:{productId:string;name:string;quantity:number;unitCost:number;total:number}[]; total:number; status:'received'; }
export interface StockAdjustment { id:string; productId:string; productName:string; timestamp:Date; delta:number; reason:string; }
export interface CashMovement { id:string; registerId:string; timestamp:Date; type:'in'|'out'|'close'; amount:number; reason:string; }
export enum AppView { DASHBOARD='dashboard', INVENTORY='inventory', POS='pos', SALES='sales', OPERATIONS='operations', AI_INSIGHTS='ai_insights' }
export interface Category { id:string; name:string; }

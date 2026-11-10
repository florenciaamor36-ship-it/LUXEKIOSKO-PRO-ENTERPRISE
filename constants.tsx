import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, History, BrainCircuit, ClipboardList } from 'lucide-react';
import { Product, Category, AppView } from './types';
export const INITIAL_CATEGORIES: Category[] = [
 {id:'1',name:'Golosinas'},{id:'2',name:'Bebidas'},{id:'3',name:'Cigarrillos'},{id:'4',name:'Snacks'},{id:'5',name:'Otros'}
];
export const INITIAL_PRODUCTS: Product[] = [
 {id:'1',name:'Alfajor Jorgito Chocolate',price:800,cost:450,stock:24,minStock:10,category:'Golosinas',barcode:'77901'},
 {id:'2',name:'Coca Cola 500ml',price:1200,cost:700,stock:15,minStock:5,category:'Bebidas',barcode:'77902'},
 {id:'3',name:'Malboro Box 20',price:2500,cost:1800,stock:8,minStock:10,category:'Cigarrillos',barcode:'77903'},
 {id:'4',name:'Papas Lays Clásicas',price:1500,cost:900,stock:12,minStock:5,category:'Snacks',barcode:'77904'}
];
export const NAVIGATION_ITEMS = [
 {id:AppView.DASHBOARD,label:'Panel',icon:<LayoutDashboard size={20}/>},
 {id:AppView.POS,label:'Venta (POS)',icon:<ShoppingCart size={20}/>},
 {id:AppView.INVENTORY,label:'Inventario',icon:<Package size={20}/>},
 {id:AppView.OPERATIONS,label:'Compras y caja',icon:<ClipboardList size={20}/>},
 {id:AppView.SALES,label:'Historial',icon:<History size={20}/>},
 {id:AppView.AI_INSIGHTS,label:'IA Consultor',icon:<BrainCircuit size={20}/>}
];

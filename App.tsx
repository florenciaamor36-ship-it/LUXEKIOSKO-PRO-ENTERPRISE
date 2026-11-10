
import React, { useState, useEffect } from 'react';
import { Product, Sale, AppView, SaleItem, RegisterSession } from './types';
import { INITIAL_PRODUCTS, NAVIGATION_ITEMS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import SalesHistory from './components/SalesHistory';
import AIConsultant from './components/AIConsultant';
import { Toaster, toast } from 'react-hot-toast';

const INITIAL_REGISTERS: RegisterSession[] = [
  { id: '1', name: 'Terminal 01', cart: [], balance: 0 },
  { id: '2', name: 'Terminal 02', cart: [], balance: 0 },
  { id: '3', name: 'Terminal 03', cart: [], balance: 0 },
  { id: '4', name: 'Terminal 04', cart: [], balance: 0 },
  { id: '5', name: 'Terminal 05', cart: [], balance: 0 },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kiosk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('kiosk_sales');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((s: any) => ({ ...s, timestamp: new Date(s.timestamp) }));
  });
  const [registers, setRegisters] = useState<RegisterSession[]>(() => {
    const saved = localStorage.getItem('kiosk_registers');
    return saved ? JSON.parse(saved) : INITIAL_REGISTERS;
  });
  const [activeRegisterId, setActiveRegisterId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('kiosk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kiosk_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('kiosk_registers', JSON.stringify(registers));
  }, [registers]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
    toast.success('Producto agregado');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.error('Producto eliminado');
  };

  const updateRegisterCart = (registerId: string, newCart: SaleItem[]) => {
    setRegisters(prev => prev.map(reg => reg.id === registerId ? { ...reg, cart: newCart } : reg));
  };

  const processSale = (registerId: string, items: SaleItem[], paymentMethod: Sale['paymentMethod']) => {
    if (items.length === 0) { toast.error('El carrito está vacío'); return null; }
    const quantities = new Map<string, number>();
    for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    for (const [productId, quantity] of quantities) {
      const product = products.find(p => p.id === productId);
      if (!product || !Number.isFinite(quantity) || quantity <= 0 || product.stock < quantity) {
        toast.error(`Stock insuficiente para ${product?.name || 'un producto'}`);
        return null;
      }
    }
    const saleTotal = items.reduce((acc, item) => acc + item.total, 0);
    if (!Number.isFinite(saleTotal) || saleTotal <= 0) { toast.error('El total de la venta no es válido'); return null; }
    const newSale: Sale = { id: `TK-${Date.now()}`, timestamp: new Date(), items: items.map(item => ({ ...item })), total: saleTotal, paymentMethod, registerId };
    setProducts(prev => prev.map(p => {
      const quantity = quantities.get(p.id) || 0;
      return quantity ? { ...p, stock: p.stock - quantity } : p;
    }));
    setSales(prev => [...prev, newSale]);
    setRegisters(prev => prev.map(reg => reg.id === registerId ? { ...reg, cart: [], balance: reg.balance + saleTotal } : reg));
    return newSale;
  };

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard products={products} sales={sales} registers={registers} />;
      case AppView.INVENTORY:
        return <Inventory products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />;
      case AppView.POS:
        return (
          <POS 
            products={products} 
            registers={registers}
            activeRegisterId={activeRegisterId}
            onSelectRegister={setActiveRegisterId}
            onUpdateCart={(cart) => activeRegisterId && updateRegisterCart(activeRegisterId, cart)}
            onCompleteSale={(items, method) => activeRegisterId ? processSale(activeRegisterId, items, method) : null} 
          />
        );
      case AppView.SALES:
        return <SalesHistory sales={sales} />;
      case AppView.AI_INSIGHTS:
        return <AIConsultant products={products} sales={sales} />;
      default:
        return <Dashboard products={products} sales={sales} registers={registers} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} onViewChange={setView} items={NAVIGATION_ITEMS} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-[1600px] mx-auto">
          {renderView()}
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default App;

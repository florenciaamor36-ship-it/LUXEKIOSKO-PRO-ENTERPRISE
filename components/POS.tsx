
import React, { useState, useMemo, useRef } from 'react';
import { Product, SaleItem, Sale, RegisterSession } from '../types';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Landmark, ShoppingBag, Zap, Monitor, ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface POSProps {
  products: Product[];
  registers: RegisterSession[];
  activeRegisterId: string | null;
  onSelectRegister: (id: string | null) => void;
  onUpdateCart: (cart: SaleItem[]) => void;
  onCompleteSale: (items: SaleItem[], paymentMethod: Sale['paymentMethod']) => Sale | null;
}

const POS: React.FC<POSProps> = ({ 
  products, 
  registers, 
  activeRegisterId, 
  onSelectRegister, 
  onUpdateCart,
  onCompleteSale 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('cash');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const activeRegister = useMemo(() => 
    registers.find(r => r.id === activeRegisterId)
  , [registers, activeRegisterId]);

  const cart = activeRegister?.cart || [];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Producto sin stock');
      return;
    }
    
    const existingIdx = cart.findIndex(item => item.productId === product.id);
    let newCart: SaleItem[];

    if (existingIdx !== -1) {
      if (cart[existingIdx].quantity >= product.stock) {
        toast.error('No hay más stock disponible');
        return;
      }
      newCart = cart.map((item, idx) => 
        idx === existingIdx 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } 
          : item
      );
    } else {
      newCart = [...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }];
    }
    onUpdateCart(newCart);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) {
          toast.error('Stock insuficiente');
          return item;
        }
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    });
    onUpdateCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    onUpdateCart(cart.filter(item => item.productId !== productId));
  };

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.total, 0), [cart]);

  const handleFinishSale = () => {
    if (cart.length === 0) return;
    const sale = onCompleteSale(cart, paymentMethod);
    if (sale) {
      setCompletedSale(sale);
      setSearchTerm('');
    }
  };

  const printTicket = () => {
    window.print();
  };

  // 1. Initial Selection Screen
  if (!activeRegisterId) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terminales de Venta</h1>
          <p className="text-slate-500 font-medium">Seleccione una caja para comenzar a operar</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {registers.map((reg) => (
            <button
              key={reg.id}
              onClick={() => onSelectRegister(reg.id)}
              disabled={!reg.isOpen} className={`group bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 text-left flex flex-col items-center disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Monitor size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">{reg.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Terminal {reg.id}</p>
              
              <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Efectivo en caja</span>
                  <span className="text-xl font-black text-slate-900">${reg.balance.toLocaleString()}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${reg.cart.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {!reg.isOpen ? 'Caja cerrada' : reg.cart.length > 0 ? `${reg.cart.length} Pendientes` : 'Abierta'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. Main POS Screen
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-500">
      
      {/* Active Register Header */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-[2rem] shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onSelectRegister(null)}
            className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h2 className="text-white font-black tracking-tight">{activeRegister?.name}</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">En operación</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800 px-6 py-2 rounded-2xl border border-slate-700">
            <p className="text-[9px] font-black text-slate-500 uppercase">Fondo de Caja</p>
            <p className="text-white font-black">${activeRegister?.balance.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-600 px-6 py-2 rounded-2xl shadow-lg shadow-indigo-600/20">
            <p className="text-[9px] font-black text-indigo-200 uppercase">Ticket Actual</p>
            <p className="text-white font-black">${total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
        {/* Product Selection Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200/60 flex flex-col overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="w-full flex items-center gap-3 bg-slate-50 px-5 py-3.5 rounded-[1.25rem] border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Escanee código de barras o busque producto..." 
                className="bg-transparent flex-1 outline-none text-sm font-semibold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 custom-scrollbar">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={p.stock <= 0}
                className={`flex flex-col text-left p-6 rounded-3xl border transition-all duration-300 group relative ${
                  p.stock <= 0 ? 'bg-slate-50 border-slate-100 opacity-50 grayscale' : 'bg-white border-slate-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1'
                }`}
              >
                <div className="mb-4 flex justify-between items-start">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-lg">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 line-clamp-2 mb-4 h-12 leading-snug">{p.name}</h3>
                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-end">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">${p.price}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${p.stock <= p.minStock ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'}`}>
                    Stock: {p.stock}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/90 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={32} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Checkout Side Panel */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6 h-full">
          <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200/60 flex flex-col overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Resumen de Compra</h3>
              <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{cart.length} items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.map(item => (
                <div key={item.productId} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate mb-2">{item.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-indigo-600"><Minus size={14} strokeWidth={3} /></button>
                        <span className="text-xs font-black w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-indigo-600"><Plus size={14} strokeWidth={3} /></button>
                      </div>
                      <span className="font-black text-slate-900 tracking-tighter text-lg">${item.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-100 bg-white space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'cash', label: 'Efectivo', icon: <Banknote size={18} /> },
                  { id: 'card', label: 'Tarjeta', icon: <CreditCard size={18} /> },
                  { id: 'transfer', label: 'Transf.', icon: <Landmark size={18} /> },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as Sale['paymentMethod'])}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      paymentMethod === method.id 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {method.icon}
                    {method.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-end px-1 border-t border-slate-50 pt-4">
                <span className="text-slate-900 font-extrabold text-sm uppercase tracking-wider mb-1">TOTAL</span>
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">${total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleFinishSale}
                disabled={cart.length === 0}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
              >
                PAGAR Y GENERAR TICKET
                <Zap size={20} className="fill-indigo-500 text-indigo-500 group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ticket Modal */}
      {completedSale && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 print:p-0 print:bg-white animate-in fade-in duration-300">
          <div className="max-w-md w-full flex flex-col gap-6 print:max-w-none">
            
            {/* Success Animation */}
            <div className="text-center print:hidden">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-white rounded-full mb-4 animate-bounce">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-white">Venta Exitosa</h2>
              <p className="text-slate-400">El ticket ha sido generado correctamente</p>
            </div>

            {/* Thermal Ticket Container */}
            <div 
              ref={ticketRef}
              className="bg-white p-10 shadow-2xl rounded-sm font-mono text-slate-800 space-y-6 print:shadow-none print:p-0 print:m-0"
              style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}
            >
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold uppercase tracking-tighter">LUXEKIOSKO PRO</h3>
                <p className="text-xs">Terminal: {activeRegister?.name}</p>
                <p className="text-xs">ID Caja: {activeRegisterId}</p>
                <p className="text-xs">{completedSale.timestamp.toLocaleString()}</p>
                <p className="text-[10px] mt-2 border-y border-dashed border-slate-300 py-1">TRANS: {completedSale.id}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold border-b border-slate-200 pb-1 uppercase">
                  <span>Cant | Descripcion</span>
                  <span>Subtotal</span>
                </div>
                {completedSale.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[11px] leading-tight">
                    <span className="flex-1 mr-2">{item.quantity}x {item.name}</span>
                    <span className="font-bold">${item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-4 space-y-1">
                <div className="flex justify-between text-sm font-bold">
                  <span>TOTAL:</span>
                  <span className="text-lg">${completedSale.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="uppercase">Pago: {completedSale.paymentMethod}</span>
                  <span>COMPROBANTE INTERNO · NO FISCAL</span>
                </div>
              </div>

              <div className="text-center pt-6 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest">¡GRACIAS POR SU COMPRA!</p>
                <p className="text-[9px] text-slate-500">Ticket de control interno; no válido como factura.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 print:hidden">
              <button 
                onClick={printTicket}
                className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
              >
                <Printer size={20} />
                IMPRIMIR TICKET
              </button>
              <button 
                onClick={() => { setCompletedSale(null); onSelectRegister(null); }}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
              >
                NUEVA VENTA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Global Style for Printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          #root { height: auto !important; position: static !important; }
          div.animate-in { animation: none !important; }
          .fixed.inset-0 { position: static !important; background: white !important; display: block !important; }
          .max-w-md { width: 100% !important; max-width: none !important; }
          .font-mono { visibility: visible !important; width: 100% !important; margin: 0 !important; }
          .font-mono * { visibility: visible !important; }
        }
      `}</style>
    </div>
  );
};

export default POS;

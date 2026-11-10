
import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Search, Edit3, Trash2, X, MoreVertical, Layers } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../constants';

interface InventoryProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: (formData.get('name') as string).trim(),
      price: Number(formData.get('price')),
      cost: Number(formData.get('cost')),
      stock: Number(formData.get('stock')),
      minStock: Number(formData.get('minStock')),
      category: (formData.get('category') as string).trim(),
      barcode: (formData.get('barcode') as string).trim(),
    };
    if (!productData.name || !productData.category || !productData.barcode ||
        !Number.isFinite(productData.price) || productData.price <= 0 ||
        !Number.isFinite(productData.cost) || productData.cost < 0 ||
        !Number.isInteger(productData.stock) || productData.stock < 0 ||
        !Number.isInteger(productData.minStock) || productData.minStock < 0) {
      alert('Revisá los datos: precio mayor a cero, costo y stock sin valores negativos; cantidades enteras.'); return;
    }
    if (products.some(p => p.barcode === productData.barcode && p.id !== editingProduct?.id)) {
      alert('Ya existe un producto con ese código de barras/SKU.'); return;
    }

    if (editingProduct) {
      onUpdate(editingProduct.id, productData);
    } else {
      onAdd(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Stock</h1>
          <p className="text-slate-500 font-medium">Control total de inventario y reposición</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-indigo-600/20 font-bold active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="flex-1 flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por descripción, SKU o código..." 
              className="flex-1 outline-none text-sm font-semibold text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                <th className="px-8 py-5">Producto / SKU</th>
                <th className="px-8 py-5">Categoría</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5">Rentabilidad</th>
                <th className="px-8 py-5">Precio</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => {
                const margin = product.price > 0 ? ((product.price - product.cost) / product.price * 100).toFixed(0) : '—';
                const isLowStock = product.stock <= product.minStock;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <Layers size={18} />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">{product.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">ID: {product.barcode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${isLowStock ? 'text-rose-500' : 'text-slate-700'}`}>
                            {product.stock} u.
                          </span>
                          {isLowStock && (
                            <span className="text-[9px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter animate-pulse">Crítico</span>
                          )}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isLowStock ? 'bg-rose-400' : 'bg-emerald-400'}`} 
                            style={{ width: `${Math.min(100, (product.stock / (product.minStock * 3)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-emerald-600 font-black text-sm">{margin}%</span>
                        <span className="text-[10px] text-slate-400 font-bold">Ganancia</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900 text-base tracking-tighter">${product.price}</p>
                      <p className="text-[10px] text-slate-400 font-bold italic">Costo: ${product.cost}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(product.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-32 text-center text-slate-400">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} strokeWidth={1} />
              </div>
              <p className="font-bold">No se encontraron productos</p>
              <p className="text-xs">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200/50 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingProduct ? 'Editar Producto' : 'Añadir al Catálogo'}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Completa los detalles maestros del producto</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all border border-slate-100">
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Descripción del Producto</label>
                  <input 
                    name="name" 
                    defaultValue={editingProduct?.name} 
                    required 
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Costo Unitario</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input name="cost" type="number" min="0" step="0.01" defaultValue={editingProduct?.cost} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Precio de Venta</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input name="price" type="number" min="0.01" step="0.01" defaultValue={editingProduct?.price} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stock Inicial</label>
                  <input name="stock" type="number" min="0" step="1" defaultValue={editingProduct?.stock} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mínimo Crítico</label>
                  <input name="minStock" type="number" min="0" step="1" defaultValue={editingProduct?.minStock} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Categoría</label>
                  <input name="category" list="product-categories" defaultValue={editingProduct?.category} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="Elegí o escribí una categoría" />
                  <datalist id="product-categories">{Array.from(new Set([...INITIAL_CATEGORIES.map(c=>c.name),...products.map(p=>p.category)])).map(name => <option key={name} value={name}/>)}</datalist>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">SKU / Código Barras</label>
                  <input name="barcode" defaultValue={editingProduct?.barcode} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-extrabold transition-all">Cancelar</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-extrabold shadow-xl shadow-indigo-200 transition-all active:scale-95">
                  {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

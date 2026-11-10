
import React from 'react';
import { Product, Sale, RegisterSession } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, AlertCircle, Wallet, ArrowUpRight, ArrowDownRight, Monitor } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  registers: RegisterSession[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, registers }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaySales = sales.filter(s => new Date(s.timestamp).setHours(0, 0, 0, 0) === today);
  const totalRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
  
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayTotal = sales
      .filter(s => new Date(s.timestamp).toDateString() === d.toDateString())
      .reduce((acc, s) => acc + s.total, 0);
    return { name: dayStr, total: dayTotal };
  });

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 font-medium">Resumen global de ventas e inventario</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas del Día" 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend="+12.5%"
          isPositive={true}
          icon={<Wallet size={20} className="text-emerald-600" />} 
          bgColor="bg-emerald-50" 
        />
        <StatCard 
          title="Stock Crítico" 
          value={lowStockProducts.length.toString()} 
          trend="Acción requerida"
          isPositive={lowStockProducts.length === 0}
          icon={<AlertCircle size={20} className="text-rose-600" />} 
          bgColor="bg-rose-50" 
          alert={lowStockProducts.length > 0}
        />
        <StatCard 
          title="Terminales Activas" 
          value={registers.length.toString()} 
          trend="Online"
          isPositive={true}
          icon={<Monitor size={20} className="text-indigo-600" />} 
          bgColor="bg-indigo-50" 
        />
        <StatCard 
          title="Margen Operativo" 
          value="42%" 
          trend="+2.1%"
          isPositive={true}
          icon={<TrendingUp size={20} className="text-amber-600" />} 
          bgColor="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Register Balances */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Balance de Cajas</h3>
          <div className="space-y-4">
            {registers.map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                    {reg.id}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{reg.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">En Línea</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${reg.balance.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-500 font-bold">Acumulado</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
          <h3 className="text-xl font-extrabold text-slate-900 mb-8">Volumen de Ventas (7D)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px' }} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  bgColor: string;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon, bgColor, alert }) => (
  <div className={`p-6 rounded-[2rem] bg-white border ${alert ? 'border-rose-200' : 'border-slate-200/60'} shadow-sm relative group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-2xl ${bgColor}`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

export default Dashboard;

import React from 'react';
import { Product, Sale, RegisterSession, AppView } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, AlertCircle, Wallet, ArrowUpRight, ArrowDownRight, Monitor, ShoppingCart, Clock3, CircleDollarSign, ChevronRight, Sparkles } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  registers: RegisterSession[];
  onNavigate?: (view: AppView) => void;
}
const money=(value:number)=>`$${(value||0).toLocaleString('es-AR')}`;
const Dashboard: React.FC<DashboardProps> = ({ products, sales, registers, onNavigate }) => {
  const now=new Date();
  const startToday=new Date(now); startToday.setHours(0,0,0,0);
  const validSales=sales.filter(s=>s.status!=='voided');
  const todaySales=validSales.filter(s=>new Date(s.timestamp)>=startToday);
  const revenue=todaySales.reduce((sum,s)=>sum+s.total,0);
  const alerts=products.filter(p=>p.stock<=p.minStock).sort((a,b)=>a.stock-b.stock);
  const openRegisters=registers.filter(r=>r.isOpen).length;
  const avgTicket=todaySales.length?revenue/todaySales.length:0;
  const totalCost=todaySales.reduce((sum,s)=>sum+s.items.reduce((subtotal,item)=>subtotal+item.quantity*(products.find(p=>p.id===item.productId)?.cost||0),0),0);
  const margin=revenue?Math.round(((revenue-totalCost)/revenue)*100):0;
  const weekly=Array.from({length:7},(_,i)=>{
    const date=new Date(); date.setDate(date.getDate()-(6-i));
    return {name:date.toLocaleDateString('es-AR',{weekday:'short'}).replace('.',''),total:validSales.filter(s=>new Date(s.timestamp).toDateString()===date.toDateString()).reduce((sum,s)=>sum+s.total,0)};
  });
  const weekTotal=weekly.reduce((sum,day)=>sum+day.total,0);
  const recent=[...validSales].sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime()).slice(0,4);
  const dateLabel=now.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});
  const statCards=[
    {title:'Ventas de hoy',value:money(revenue),note:`${todaySales.length} ${todaySales.length===1?'venta':'ventas'} registradas`,icon:<Wallet size={19}/>,tone:'emerald'},
    {title:'Stock para revisar',value:String(alerts.length),note:alerts.length?`${alerts.length} producto${alerts.length===1?'':'s'} en mínimo`: 'Todo el stock está sobre el mínimo',icon:<AlertCircle size={19}/>,tone:alerts.length?'rose':'emerald'},
    {title:'Cajas abiertas',value:`${openRegisters} / ${registers.length}`,note:'Estado actual de las terminales',icon:<Monitor size={19}/>,tone:'blue'},
    {title:'Ticket promedio',value:money(avgTicket),note:`Margen bruto estimado: ${margin}%`,icon:<CircleDollarSign size={19}/>,tone:'amber'},
  ];
  const toneClasses:Record<string,string>={emerald:'bg-emerald-50 text-emerald-700',rose:'bg-rose-50 text-rose-600',blue:'bg-blue-50 text-blue-700',amber:'bg-amber-50 text-amber-700'};
  return <div className="space-y-5 pb-8">
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-emerald-700 mb-2">Operación del día</p><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resumen general</h1><p className="text-slate-500 mt-1 text-sm">{dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1)} · Lo importante de tu kiosco, en un vistazo.</p></div>
      <span className="self-start sm:self-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600">● Datos de este navegador</span>
    </header>
    <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 md:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg shadow-emerald-950/10 overflow-hidden relative">
      <div className="relative z-10"><div className="flex items-center gap-2 text-emerald-200 text-[10px] font-bold uppercase tracking-[.16em]"><Sparkles size={14}/> Tu negocio, en un vistazo</div><h2 className="text-xl md:text-2xl font-extrabold mt-2">Un buen día empieza con todo bajo control.</h2><p className="text-emerald-100/80 text-sm mt-1">Revisá tus ventas, cajas y productos que necesitan atención.</p></div>
      <button onClick={()=>onNavigate?.(AppView.POS)} className="relative z-10 shrink-0 bg-lime-300 hover:bg-lime-200 text-emerald-950 font-extrabold text-sm rounded-xl px-4 py-3 transition-colors flex items-center gap-2"><ShoppingCart size={16}/> Ir a punto de venta <ChevronRight size={16}/></button>
      <div className="absolute -right-6 -top-16 text-[210px] leading-none text-white/[.035] select-none">✳</div>
    </section>
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map(card=><article key={card.title} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">{card.title}</span><span className={`w-10 h-10 rounded-xl grid place-items-center ${toneClasses[card.tone]}`}>{card.icon}</span></div><p className="text-2xl font-black text-slate-900 tracking-tight mt-3">{card.value}</p><p className="text-xs text-slate-500 mt-1">{card.note}</p></article>)}
    </section>
    <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
      <article className="xl:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm min-w-0"><div className="flex flex-wrap justify-between items-start gap-3 mb-3"><div><h3 className="font-extrabold text-slate-900">Ventas de la semana</h3><p className="text-xs text-slate-500 mt-1">Ingresos registrados por día · últimos 7 días</p></div><div className="text-right"><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total semanal</p><b className="text-lg text-slate-900">{money(weekTotal)}</b></div></div><div className="h-[225px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly} margin={{top:8,right:8,left:0,bottom:0}}><defs><linearGradient id="actualSalesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#438967" stopOpacity={0.24}/><stop offset="95%" stopColor="#438967" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid strokeDasharray="4 5" vertical={false} stroke="#edf1ed"/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#89968d',fontSize:11,fontWeight:600}} dy={10}/><YAxis axisLine={false} tickLine={false} width={58} tick={{fill:'#89968d',fontSize:10}} tickFormatter={(n)=>n>=1000?`$${Math.round(n/1000)}k`:`$${n}`}/><Tooltip formatter={(v:number)=>[money(v),'Ventas']} labelStyle={{fontWeight:700,color:'#253a30'}} contentStyle={{borderRadius:12,border:'1px solid #e7ece7',boxShadow:'0 8px 25px #102b1c15',fontSize:12}}/><Area type="monotone" dataKey="total" stroke="#438967" strokeWidth={3} fill="url(#actualSalesFill)" activeDot={{r:5,strokeWidth:2}}/></AreaChart></ResponsiveContainer></div><p className="text-[10px] text-slate-400">El gráfico se actualiza con las ventas guardadas localmente.</p></article>
      <article className="xl:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm"><div className="flex justify-between items-start gap-2 mb-2"><div><h3 className="font-extrabold text-slate-900">Stock para revisar</h3><p className="text-xs text-slate-500 mt-1">Productos en el mínimo o por debajo</p></div><button onClick={()=>onNavigate?.(AppView.INVENTORY)} className="text-emerald-700 text-xs font-bold hover:underline">Inventario →</button></div><div className="divide-y divide-slate-100">{alerts.slice(0,5).map(p=><div key={p.id} className="py-3 flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 grid place-items-center"><Package size={17}/></div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-800 truncate">{p.name}</p><p className="text-[10px] text-slate-400">{p.category} · mínimo {p.minStock} un.</p></div><span className="text-xs font-extrabold text-rose-600 whitespace-nowrap">{p.stock} un.</span></div>)}{!alerts.length&&<div className="py-10 text-center"><div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center mb-2">✓</div><p className="text-sm font-bold text-slate-700">Sin alertas de stock</p><p className="text-xs text-slate-400 mt-1">Todos los productos superan su mínimo.</p></div>}</div></article>
    </section>
    <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm"><div className="flex flex-wrap justify-between items-start gap-2 mb-4"><div><h3 className="font-extrabold text-slate-900">Estado de cajas</h3><p className="text-xs text-slate-500 mt-1">Balance local de cada terminal</p></div><button onClick={()=>onNavigate?.(AppView.OPERATIONS)} className="text-emerald-700 text-xs font-bold hover:underline">Compras y caja →</button></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3">{registers.map(reg=><article key={reg.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4"><div className="flex items-center justify-between gap-2"><b className="text-xs text-slate-800">{reg.name}</b><span className={`text-[9px] font-bold px-2 py-1 rounded-full ${reg.isOpen?'text-emerald-700 bg-emerald-100':'text-slate-500 bg-slate-200'}`}>● {reg.isOpen?'Abierta':'Cerrada'}</span></div><p className="text-lg font-extrabold text-slate-900 mt-3">{money(reg.balance)}</p><p className="text-[10px] text-slate-400">{reg.isOpen?'Saldo de caja':'Disponible para abrir'}</p></article>)}</div></section>
    <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm"><div className="flex justify-between items-start gap-2 mb-3"><div><h3 className="font-extrabold text-slate-900">Últimas ventas</h3><p className="text-xs text-slate-500 mt-1">Movimientos recientes del historial</p></div><button onClick={()=>onNavigate?.(AppView.SALES)} className="text-emerald-700 text-xs font-bold hover:underline">Ver historial →</button></div>{recent.length?<div className="divide-y divide-slate-100">{recent.map(s=><div key={s.id} className="py-3 flex flex-wrap items-center gap-3"><span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center"><Clock3 size={16}/></span><div className="flex-1 min-w-[120px]"><p className="text-xs font-bold text-slate-800">Ticket {s.id}</p><p className="text-[10px] text-slate-400">{new Date(s.timestamp).toLocaleString('es-AR')} · {registers.find(r=>r.id===s.registerId)?.name||'Caja'} · {s.items.reduce((n,i)=>n+i.quantity,0)} productos</p></div><span className="text-[10px] capitalize rounded-full bg-slate-100 px-2 py-1 text-slate-600">{s.paymentMethod==='cash'?'Efectivo':s.paymentMethod==='card'?'Tarjeta':'Transferencia'}</span><b className="text-sm text-slate-900 min-w-20 text-right">{money(s.total)}</b></div>)}</div>:<div className="rounded-xl bg-slate-50 text-center px-4 py-8"><p className="text-sm font-bold text-slate-700">Todavía no hay ventas registradas</p><p className="text-xs text-slate-500 mt-1">Cuando registres una venta, aparecerá acá.</p><button onClick={()=>onNavigate?.(AppView.POS)} className="mt-3 inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg px-3 py-2 text-xs font-bold"><ShoppingCart size={14}/> Abrir punto de venta</button></div>}</section>
    <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1"><TrendingUp size={12}/> Indicadores calculados con los datos que están guardados en este navegador; no hay sincronización con otros equipos.</p>
  </div>;
};
export default Dashboard;

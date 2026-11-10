
import React from 'react';
import { AppView } from '../types';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  items: { id: AppView; label: string; icon: React.ReactNode }[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, items }) => {
  return (
    <aside className="w-20 md:w-72 sidebar-gradient text-slate-300 flex flex-col h-screen sticky top-0 transition-all duration-500 shadow-2xl z-50">
      <div className="p-6 flex items-center gap-4 border-b border-slate-800/50">
        <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 text-white transform hover:rotate-12 transition-transform">
          <ShieldCheck size={26} strokeWidth={2.5} />
        </div>
        <div className="hidden md:block">
          <h1 className="font-extrabold text-xl tracking-tight text-white">LuxeKiosko</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Edition</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-6">
        <p className="hidden md:block text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-3 mb-4">Menú Principal</p>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1'
                : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="hidden md:block font-semibold text-sm flex-1 text-left">{item.label}</span>
            {currentView === item.id && <ChevronRight size={14} className="hidden md:block opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="hidden md:flex items-center gap-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white shadow-inner">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Admin Luxe</p>
            <p className="text-[10px] text-slate-500 font-medium">Premium User</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

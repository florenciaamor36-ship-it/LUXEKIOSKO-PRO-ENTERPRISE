
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { getKioskInsights } from '../services/geminiService';
import { BrainCircuit, Sparkles, Loader2, Target, Lightbulb, TrendingUp } from 'lucide-react';

interface AIConsultantProps {
  products: Product[];
  sales: Sale[];
}

const AIConsultant: React.FC<AIConsultantProps> = ({ products, sales }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getKioskInsights(products, sales);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl">
        {/* Animated background patterns */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-300 backdrop-blur-sm">
              <Sparkles size={14} />
              Inteligencia Predictiva Activada
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Impulsa tu Rentabilidad con <span className="text-indigo-400">Insights IA</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              Nuestra IA de grado empresarial analiza cada transacción para identificar patrones ocultos y optimizar tu flujo de caja de forma automática.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 text-white px-8 py-4 rounded-[1.5rem] font-black text-lg flex items-center gap-4 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
              {loading ? 'Procesando Big Data...' : 'Generar Diagnóstico Estratégico'}
            </button>
          </div>
          <div className="hidden lg:flex w-64 h-64 bg-slate-800 rounded-full items-center justify-center relative border border-slate-700/50">
             <div className="absolute inset-0 border-4 border-dashed border-slate-700 rounded-full animate-[spin_20s_linear_infinite]"></div>
             <BrainCircuit size={100} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {insight ? (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200/60 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Target size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Estrategia Recomendada</h3>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Informe Ejecutivo Generado Hoy</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/30"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/10"></div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-1 gap-10">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-line text-slate-700 text-xl font-medium leading-relaxed bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 italic">
                  "{insight}"
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightFeatureCard 
                  icon={<Lightbulb className="text-amber-500" />} 
                  title="Oportunidad" 
                  desc="Identificación de stock estancado con potencial de rotación." 
                />
                <InsightFeatureCard 
                  icon={<TrendingUp className="text-emerald-500" />} 
                  title="Escalabilidad" 
                  desc="Proyección de demanda basada en historial de ventas." 
                />
                <InsightFeatureCard 
                  icon={<Target className="text-indigo-500" />} 
                  title="Precisión" 
                  desc="Márgenes optimizados por categoría de producto." 
                />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Security Verified & Analytics Ready</span>
              <span className="flex items-center gap-2">
                Powered by <span className="text-indigo-600 font-black">Gemini 2.5 Ultra-Flash</span>
              </span>
            </div>
          </div>
        ) : !loading && (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-dashed border-slate-300 text-center">
            <div className="bg-slate-50 p-6 rounded-full inline-flex mb-6">
              <Sparkles size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Centro de Inteligencia de Negocios</h3>
            <p className="text-slate-500 max-w-md mx-auto font-medium">
              Esperando que inicies el análisis de datos para desbloquear recomendaciones accionables y optimizar tu rentabilidad diaria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const InsightFeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h4 className="font-black text-slate-800 mb-2">{title}</h4>
    <p className="text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
  </div>
);

export default AIConsultant;

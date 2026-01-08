
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, BrainCircuit, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction, Lending, Debt, Goal, Budget } from '../types';

interface Props {
  transactions: Transaction[];
  lendings: Lending[];
  debts: Debt[];
  goals: Goal[];
  budgets: Budget[];
}

const AISuggestions: React.FC<Props> = ({ transactions, lendings, debts, goals, budgets }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ suggestions: any[], overallHealthScore: number } | null>(null);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice({ transactions, lendings, debts, goals, budgets });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <header className="text-center space-y-2">
        <div className="w-16 h-16 bg-indigo-50 rounded-[2rem] mx-auto flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">AI Financial Coach</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-8">Personalized Insights in ₹</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-xs font-black text-gray-400 animate-pulse uppercase tracking-widest">Consulting the oracle...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Wealth Health Score</p>
              <h3 className="text-4xl font-black text-indigo-600 tracking-tight">{data?.overallHealthScore ?? '--'}/100</h3>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-gray-100" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-600" strokeDasharray={`${data?.overallHealthScore ?? 0}, 100`} stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-gray-700 flex items-center gap-2 text-sm uppercase tracking-widest">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              Strategy Intelligence
            </h4>
            
            {data?.suggestions.map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 relative overflow-hidden group hover:border-indigo-200 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      s.category === 'Debt' ? 'bg-red-50 text-red-600' : 
                      s.category === 'Lending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {s.category === 'Debt' ? <AlertTriangle className="w-4 h-4" /> : 
                       s.category === 'Lending' ? <BrainCircuit className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <h5 className="font-black text-gray-800 text-sm tracking-tight">{s.title}</h5>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{s.category} • {s.impact} Impact</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-bold">
                  {s.advice}
                </p>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-50/20 rounded-full blur-2xl -mr-12 -mb-12 group-hover:bg-indigo-100 transition-colors"></div>
              </div>
            ))}
          </div>

          <button 
            onClick={fetchAdvice}
            className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Recalculate Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;


import React, { useState } from 'react';
import { Plus, CreditCard, AlertCircle, Info, X } from 'lucide-react';
import { Debt } from '../types';

interface Props {
  debts: Debt[];
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
}

const DebtManager: React.FC<Props> = ({ debts, setDebts }) => {
  const [showAdd, setShowAdd] = useState(false);
  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);

  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '',
    totalAmount: 0,
    interestRate: 0,
    emi: 0,
    nextDueDate: ''
  });

  const handleAdd = () => {
    if(!newDebt.name || !newDebt.totalAmount) return;
    const debt: Debt = {
      id: Date.now().toString(),
      name: newDebt.name,
      totalAmount: Number(newDebt.totalAmount),
      remainingAmount: Number(newDebt.totalAmount),
      interestRate: Number(newDebt.interestRate),
      emi: Number(newDebt.emi),
      nextDueDate: newDebt.nextDueDate || new Date().toISOString().split('T')[0]
    };
    setDebts(prev => [...prev, debt]);
    setShowAdd(false);
    setNewDebt({ name: '', totalAmount: 0, interestRate: 0, emi: 0, nextDueDate: '' });
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Debt & EMIs</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Liabilities</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-100">
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <section className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Outstanding</p>
            <h3 className="text-3xl font-black text-gray-900">₹{totalDebt.toLocaleString()}</h3>
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl flex items-center gap-3 text-amber-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold leading-tight">Pay off high-interest loans first to save on interest costs.</p>
        </div>
      </section>

      <div className="space-y-4">
        {debts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
             <Info className="w-12 h-12 opacity-10" />
             <p className="font-bold">No active loans.</p>
          </div>
        ) : (
          debts.map(debt => (
            <div key={debt.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-gray-800 tracking-tight">{debt.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Interest: {debt.interestRate}% • Due: {debt.nextDueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-red-600 text-lg">₹{debt.remainingAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">EMI: ₹{debt.emi.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(1 - debt.remainingAmount / debt.totalAmount) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">Add Loan Entry</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Loan Name (e.g. Car Loan)"
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 outline-none"
                onChange={e => setNewDebt({...newDebt, name: e.target.value})}
              />
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Total Principal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl text-gray-400">₹</span>
                  <input 
                    type="number" 
                    placeholder="Total Amount"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 pl-10 font-bold text-xl text-gray-800 outline-none"
                    onChange={e => setNewDebt({...newDebt, totalAmount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Rate (%)</label>
                  <input 
                    type="number" 
                    placeholder="Rate %"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 outline-none"
                    onChange={e => setNewDebt({...newDebt, interestRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Monthly EMI</label>
                  <input 
                    type="number" 
                    placeholder="EMI ₹"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 outline-none"
                    onChange={e => setNewDebt({...newDebt, emi: Number(e.target.value)})}
                  />
                </div>
              </div>
              <button 
                onClick={handleAdd}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-100 active:scale-95 transition-all"
              >
                Confirm Debt Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtManager;


import React, { useState, useMemo } from 'react';
import { Plus, Handshake, Calendar, X, AlertTriangle, CheckCircle2, Info, ChevronRight, User } from 'lucide-react';
import { Lending, Transaction, Debt, Budget, Goal } from '../types';

interface Props {
  lendings: Lending[];
  setLendings: React.Dispatch<React.SetStateAction<Lending[]>>;
  transactions: Transaction[];
  debts: Debt[];
  budgets: Budget[];
  goals: Goal[];
}

const LendingManager: React.FC<Props> = ({ lendings, setLendings, transactions, debts, budgets, goals }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLending, setSelectedLending] = useState<Lending | null>(null);
  
  const [newLending, setNewLending] = useState<Partial<Lending>>({
    personName: '',
    totalAmount: 0,
    purpose: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [paymentAmount, setPaymentAmount] = useState(0);

  // Safety Calculation Logic
  const safetyStats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalEmis = debts.reduce((s, d) => s + d.emi, 0);
    const remainingBudgets = budgets.reduce((s, b) => s + (b.limit - b.spent), 0);
    
    // Liquid cash available this month after commitments
    const availableCash = income - expenses - remainingBudgets - totalEmis;
    
    return { availableCash };
  }, [transactions, debts, budgets]);

  const handleAdd = () => {
    if (!newLending.personName || !newLending.totalAmount) return;
    const lending: Lending = {
      id: Date.now().toString(),
      personName: newLending.personName,
      totalAmount: Number(newLending.totalAmount),
      paidBackAmount: 0,
      date: newLending.date || new Date().toISOString().split('T')[0],
      purpose: newLending.purpose || 'Personal',
      status: 'pending'
    };
    setLendings(prev => [lending, ...prev]);
    setShowAdd(false);
    setNewLending({ personName: '', totalAmount: 0, purpose: '', date: new Date().toISOString().split('T')[0] });
  };

  const updatePayment = (lending: Lending) => {
    if (paymentAmount <= 0) return;
    
    const newPaidAmount = lending.paidBackAmount + paymentAmount;
    const isCleared = newPaidAmount >= lending.totalAmount;

    setLendings(prev => prev.map(l => l.id === lending.id ? {
      ...l,
      paidBackAmount: Math.min(newPaidAmount, l.totalAmount),
      status: isCleared ? 'cleared' : 'partially_paid'
    } : l));
    
    setSelectedLending(null);
    setPaymentAmount(0);
  };

  const totalOwed = lendings.reduce((s, l) => s + (l.totalAmount - l.paidBackAmount), 0);

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Lending Manager</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Track your kindness</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Summary Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-2">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Currently Owed to You</p>
        <h3 className="text-4xl font-black text-gray-900">₹{totalOwed.toLocaleString()}</h3>
        <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs">
          <Info className="w-4 h-4" />
          <span>{lendings.filter(l => l.status !== 'cleared').length} active lendings</span>
        </div>
      </section>

      {/* Lending List */}
      <section className="space-y-4">
        <h4 className="font-bold text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          Recent Transactions
        </h4>
        
        {lendings.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 space-y-3">
             <Handshake className="w-12 h-12 mx-auto opacity-10" />
             <p className="font-bold text-sm">No money given to anyone yet.</p>
          </div>
        ) : (
          lendings.map(l => (
            <div 
              key={l.id} 
              onClick={() => l.status !== 'cleared' && setSelectedLending(l)}
              className={`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group transition-all cursor-pointer ${l.status === 'cleared' ? 'opacity-60 bg-gray-50' : 'hover:border-indigo-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${l.status === 'cleared' ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{l.personName}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {l.purpose} • {l.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black ${l.status === 'cleared' ? 'text-gray-400' : 'text-gray-800'}`}>₹{(l.totalAmount - l.paidBackAmount).toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-[10px] font-bold justify-end ${l.status === 'cleared' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {l.status === 'cleared' ? <CheckCircle2 className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span className="uppercase tracking-tighter">{l.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Add Lending Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">New Lending Entry</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Recipient</label>
                <input 
                  type="text" 
                  placeholder="Person's Name"
                  className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  onChange={e => setNewLending({...newLending, personName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl text-gray-400">₹</span>
                  <input 
                    type="number" 
                    placeholder="Amount Given"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 pl-10 font-bold text-2xl text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    onChange={e => setNewLending({...newLending, totalAmount: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Purpose</label>
                <input 
                  type="text" 
                  placeholder="e.g. Travel, Lunch, Emergency"
                  className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  onChange={e => setNewLending({...newLending, purpose: e.target.value})}
                />
              </div>

              {/* Safety Calculator UI */}
              <div className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
                Number(newLending.totalAmount || 0) > safetyStats.availableCash ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {Number(newLending.totalAmount || 0) > safetyStats.availableCash ? 
                    <AlertTriangle className="w-4 h-4 text-red-600" /> : 
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  }
                  <span className="text-xs font-black uppercase tracking-widest">Safety Analysis</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {Number(newLending.totalAmount || 0) > safetyStats.availableCash ? 
                    `Warning: This exceeds your liquid cash (₹${Math.max(0, safetyStats.availableCash).toLocaleString()}) for the month.` : 
                    `Safe to lend. You have enough buffer for expenses, EMI, and goals.`
                  }
                </p>
              </div>

              <button 
                onClick={handleAdd}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Confirm Lending
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repayment Modal */}
      {selectedLending && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-800">Repayment Entry</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{selectedLending.personName}</p>
              </div>
              <button onClick={() => setSelectedLending(null)}><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Still Pending</span>
                <span className="text-xl font-black text-indigo-600">₹{(selectedLending.totalAmount - selectedLending.paidBackAmount).toLocaleString()}</span>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Amount Paid Back Now</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl text-gray-400">₹</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 pl-10 font-black text-2xl text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setPaymentAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <button 
                onClick={() => updatePayment(selectedLending)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100"
              >
                Log Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendingManager;

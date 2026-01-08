
import React, { useState } from 'react';
import { Plus, X, Trash2, Receipt, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction, Budget, TransactionType } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  budgets: Budget[];
}

const ExpenseTracker: React.FC<Props> = ({ transactions, setTransactions, budgets }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: 'expense',
    category: 'Food',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleAddTransaction = () => {
    if (!newTx.amount || newTx.amount <= 0) return;
    
    const tx: Transaction = {
      id: Date.now().toString(),
      amount: Number(newTx.amount),
      category: newTx.category || 'Others',
      date: newTx.date || new Date().toISOString().split('T')[0],
      type: (newTx.type as TransactionType) || 'expense',
      note: newTx.note || ''
    };

    setTransactions(prev => [tx, ...prev]);
    setShowAddModal(false);
    setNewTx({ type: 'expense', category: 'Food', amount: 0, date: new Date().toISOString().split('T')[0], note: '' });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => 
    filterType === 'all' ? true : t.type === filterType
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Financial History</h2>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
        >
            <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
        {(['all', 'income', 'expense'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex-1 py-2 text-xs font-black capitalize rounded-xl transition-all ${
              filterType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
            <Receipt className="w-12 h-12 opacity-10" />
            <p className="font-bold">No history recorded.</p>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{tx.category}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{tx.date} • {tx.note || 'No note'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-800'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </p>
                <button 
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">Add Record</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                <button 
                    onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                    className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest ${newTx.type === 'expense' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                >
                    Expense
                </button>
                <button 
                    onClick={() => setNewTx({ ...newTx, type: 'income' })}
                    className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest ${newTx.type === 'income' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
                >
                    Income
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-2xl text-gray-400">₹</span>
                  <input 
                    type="number" 
                    value={newTx.amount === 0 ? '' : newTx.amount}
                    onChange={e => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 pl-10 font-black text-3xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Category</label>
                  <select 
                    value={newTx.category}
                    onChange={e => setNewTx({ ...newTx, category: e.target.value })}
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-700 outline-none appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Date</label>
                  <input 
                    type="date"
                    value={newTx.date}
                    onChange={e => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Note</label>
                <input 
                  type="text" 
                  value={newTx.note}
                  onChange={e => setNewTx({ ...newTx, note: e.target.value })}
                  className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-700 outline-none"
                  placeholder="Details..."
                />
              </div>

              <button 
                onClick={handleAddTransaction}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100"
              >
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;

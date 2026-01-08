
import React, { useState } from 'react';
import { Target, Plus, Heart, Plane, ShieldCheck, Laptop, X } from 'lucide-react';
import { Goal } from '../types';

interface Props {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalTracker: React.FC<Props> = ({ goals, setGoals }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    category: 'Travel'
  });

  const handleAdd = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;
    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount || 0),
      deadline: newGoal.deadline || '',
      category: newGoal.category || 'Others'
    };
    setGoals(prev => [...prev, goal]);
    setShowAdd(false);
    setNewGoal({ name: '', targetAmount: 0, currentAmount: 0, deadline: '', category: 'Travel' });
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Travel': return <Plane className="w-6 h-6" />;
      case 'Emergency': return <ShieldCheck className="w-6 h-6" />;
      case 'Gadgets': return <Laptop className="w-6 h-6" />;
      default: return <Heart className="w-6 h-6" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Financial Goals</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Future Planning</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100">
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {goals.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-10" />
            <p className="font-bold text-sm">No goals set yet.</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:border-emerald-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem] group-hover:scale-110 transition-transform">
                  {getIcon(goal.category)}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-800 tracking-tight">{goal.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target: {goal.deadline || 'Ongoing'}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600 text-lg">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-emerald-600">₹{goal.currentAmount.toLocaleString()}</span>
                  <span className="text-gray-400">Target ₹{goal.targetAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">New Vision</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Goal Name (e.g. World Tour)"
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 outline-none"
                onChange={e => setNewGoal({...newGoal, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                  <input 
                    type="number" 
                    placeholder="Amount"
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 pl-10 font-bold text-gray-800 outline-none"
                    onChange={e => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                  />
                </div>
                <select 
                   className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-700 outline-none appearance-none"
                   onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                >
                  <option value="Travel">Travel</option>
                  <option value="Emergency">Emergency Fund</option>
                  <option value="Gadgets">Gadgets</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <input 
                type="date" 
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 outline-none"
                onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
              />
              <button 
                onClick={handleAdd}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 active:scale-95 transition-all"
              >
                Set Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;

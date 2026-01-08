
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, Lending, Debt, Budget, Goal } from '../types';
import { ArrowUpRight, ArrowDownLeft, ChevronRight, Target, Sparkles, Handshake } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  lendings: Lending[];
  debts: Debt[];
  budgets: Budget[];
  goals: Goal[];
}

const Dashboard: React.FC<Props> = ({ transactions, lendings, debts, budgets, goals }) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalOwed = lendings.reduce((s, l) => s + (l.totalAmount - l.paidBackAmount), 0);
  const totalDebt = debts.reduce((s, d) => s + d.remainingAmount, 0);
  
  // Net worth: Money in - Money out + Money others owe you - Money you owe others
  const netWorth = totalIncome - totalExpense + totalOwed - totalDebt;

  const budgetData = budgets.map(b => ({
    name: b.category,
    spent: b.spent,
    limit: b.limit,
    percent: Math.min(Math.round((b.spent / b.limit) * 100), 100)
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const categoryData = budgets.map((b) => ({
    name: b.category,
    value: b.spent
  })).filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-8">
      {/* Net Worth Card */}
      <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Estimated Net Worth</p>
          <h2 className="text-4xl font-bold mb-4">₹{netWorth.toLocaleString()}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-500/30 rounded-2xl p-3 flex items-center gap-2">
              <div className="p-2 bg-green-400 rounded-full">
                <ArrowDownLeft className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 uppercase tracking-wider font-bold">Incomes</p>
                <p className="text-sm font-bold">₹{totalIncome.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-indigo-500/30 rounded-2xl p-3 flex items-center gap-2">
              <div className="p-2 bg-red-400 rounded-full">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 uppercase tracking-wider font-bold">Expenses</p>
                <p className="text-sm font-bold">₹{totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* Lending Summary */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Money Owed to You</p>
            <h3 className="text-2xl font-black text-gray-900">₹{totalOwed.toLocaleString()}</h3>
          </div>
        </div>
        <ChevronRight className="text-gray-300" />
      </section>

      {/* Spending Breakdown */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-gray-800 tracking-tight">Spending Breakdown</h3>
        </div>
        
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-52">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
              <Sparkles className="w-8 h-8 opacity-20" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Monthly Budgets */}
      <section className="space-y-4">
        <h3 className="font-black text-gray-800 tracking-tight">Budget Progress</h3>
        <div className="grid grid-cols-1 gap-4">
          {budgetData.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">{item.name}</span>
                <span className="text-xs font-bold text-gray-400">₹{item.spent} / ₹{item.limit}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${item.percent > 90 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Goal Preview */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold">Next Goal Progress</h4>
            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Dream Big</p>
          </div>
        </div>
        {goals.length > 0 ? (
            <div>
                <p className="text-sm font-bold mb-1">{goals[0].name}</p>
                <div className="flex items-end justify-between mt-1 mb-2">
                    <span className="text-2xl font-black text-white">₹{goals[0].currentAmount.toLocaleString()}</span>
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">of ₹{goals[0].targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border border-white/10">
                    <div 
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${(goals[0].currentAmount / goals[0].targetAmount) * 100}%` }}
                    />
                </div>
            </div>
        ) : (
            <p className="text-sm opacity-90 italic">No goals set. Start your saving journey!</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

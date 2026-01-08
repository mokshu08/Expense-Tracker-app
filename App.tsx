
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Handshake, 
  CreditCard, 
  Target, 
  Sparkles, 
  Wallet
} from 'lucide-react';
import { AppTab, Transaction, Lending, Debt, Goal, Budget } from './types';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './components/ExpenseTracker';
import LendingManager from './components/LendingManager';
import DebtManager from './components/DebtManager';
import GoalTracker from './components/GoalTracker';
import AISuggestions from './components/AISuggestions';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('wf_transactions');
    const savedLendings = localStorage.getItem('wf_lendings');
    const savedDebts = localStorage.getItem('wf_debts');
    const savedGoals = localStorage.getItem('wf_goals');
    const savedBudgets = localStorage.getItem('wf_budgets');

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedLendings) setLendings(JSON.parse(savedLendings));
    if (savedDebts) setDebts(JSON.parse(savedDebts));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    else {
      setBudgets([
        { category: 'Food', limit: 15000, spent: 0 },
        { category: 'Shopping', limit: 10000, spent: 0 },
        { category: 'Rent', limit: 25000, spent: 0 },
        { category: 'Others', limit: 5000, spent: 0 }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wf_transactions', JSON.stringify(transactions));
    const updatedBudgets = budgets.map(b => {
      const spent = transactions
        .filter(t => t.category === b.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
    if (JSON.stringify(updatedBudgets) !== JSON.stringify(budgets)) {
        setBudgets(updatedBudgets);
    }
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wf_lendings', JSON.stringify(lendings));
  }, [lendings]);

  useEffect(() => {
    localStorage.setItem('wf_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('wf_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
      localStorage.setItem('wf_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} lendings={lendings} debts={debts} budgets={budgets} goals={goals} />;
      case 'expenses':
        return <ExpenseTracker transactions={transactions} setTransactions={setTransactions} budgets={budgets} />;
      case 'lending':
        return <LendingManager lendings={lendings} setLendings={setLendings} transactions={transactions} debts={debts} budgets={budgets} goals={goals} />;
      case 'debts':
        return <DebtManager debts={debts} setDebts={setDebts} />;
      case 'goals':
        return <GoalTracker goals={goals} setGoals={setGoals} />;
      case 'ai':
        return <AISuggestions transactions={transactions} lendings={lendings} debts={debts} goals={goals} budgets={budgets} />;
      default:
        return <Dashboard transactions={transactions} lendings={lendings} debts={debts} budgets={budgets} goals={goals} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'expenses', label: 'History', icon: Receipt },
    { id: 'lending', label: 'Lending', icon: Handshake },
    { id: 'debts', label: 'Debts', icon: CreditCard },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'ai', label: 'Coach', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden shadow-2xl relative border-x border-gray-200">
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-black text-indigo-600 flex items-center gap-2 tracking-tight">
            <Wallet className="w-6 h-6" />
            WealthFlow
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activeTab}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
          JD
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-2 py-3 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AppTab)}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === item.id ? 'text-indigo-600 scale-110' : 'text-gray-400'
            }`}
          >
            <item.icon className="w-6 h-6" strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;

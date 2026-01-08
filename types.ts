
export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  note: string;
}

export type LendingStatus = 'pending' | 'partially_paid' | 'cleared';

export interface Lending {
  id: string;
  personName: string;
  totalAmount: number;
  paidBackAmount: number;
  date: string;
  purpose: string;
  status: LendingStatus;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  nextDueDate: string;
  emi: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export type AppTab = 'dashboard' | 'expenses' | 'lending' | 'debts' | 'goals' | 'ai';

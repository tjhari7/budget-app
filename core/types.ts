export type BudgetType = 'need' | 'want' | 'save';

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  note: string;
  date: string; // ISO string
  tag: BudgetType;
}

export interface Category {
  id: string;
  name: string;
  type: BudgetType;
  icon: string;
  color: string;
  monthlyLimit: number;
  transactions: Transaction[];
  createdAt: string; // ISO string
}

export interface AppSettings {
  monthlyIncome: number;
  needsPercent: number;
  wantsPercent: number;
  savingsPercent: number;
  currency: string;
}

export interface BudgetState {
  categories: Category[];
  settings: AppSettings;
  hasSeeded: boolean;
}

export interface PeriodBudget {
  total: number;
  needsTarget: number;
  wantsTarget: number;
  savingsTarget: number;
}

export interface CategoryStats {
  spent: number;
  limit: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
}

export interface TypeStats {
  spent: number;
  target: number;
  percent: number;
  isOverBudget: boolean;
}

export interface DashboardStats {
  periodBudget: PeriodBudget;
  totalSpent: number;
  totalRemaining: number;
  totalSaved: number;
  needs: TypeStats;
  wants: TypeStats;
  savings: TypeStats;
  isOnTrack: boolean;
}

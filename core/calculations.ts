import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import type { Category, Period, BudgetType, PeriodBudget, CategoryStats, TypeStats, DashboardStats, AppSettings, Transaction } from './types';

export const PERIOD_MULTIPLIERS: Record<Period, number> = {
  daily: 1 / 30,
  weekly: 1 / 4.33,
  monthly: 1,
  yearly: 12,
};

export function getPeriodInterval(period: Period, date: Date = new Date()): { start: Date; end: Date } {
  switch (period) {
    case 'daily':
      return { start: startOfDay(date), end: endOfDay(date) };
    case 'weekly':
      return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
    case 'monthly':
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case 'yearly':
      return { start: startOfYear(date), end: endOfYear(date) };
  }
}

export function scaleToPeriod(monthlyValue: number, period: Period): number {
  return monthlyValue * PERIOD_MULTIPLIERS[period];
}

export function getTransactionsForPeriod(transactions: Transaction[], period: Period): Transaction[] {
  const interval = getPeriodInterval(period);
  return transactions.filter(t => {
    const date = parseISO(t.date);
    return isWithinInterval(date, interval);
  });
}

export function getCategorySpent(category: Category, period: Period): number {
  const txns = getTransactionsForPeriod(category.transactions, period);
  return txns.reduce((sum, t) => sum + t.amount, 0);
}

export function getCategoryStats(category: Category, period: Period): CategoryStats {
  const spent = getCategorySpent(category, period);
  const limit = scaleToPeriod(category.monthlyLimit, period);
  const remaining = limit - spent;
  const percentUsed = limit > 0 ? (spent / limit) * 100 : 0;
  return {
    spent,
    limit,
    remaining,
    percentUsed,
    isOverBudget: spent > limit,
  };
}

export function getPeriodBudget(settings: AppSettings, period: Period): PeriodBudget {
  const { monthlyIncome, needsPercent, wantsPercent, savingsPercent } = settings;
  const total = scaleToPeriod(monthlyIncome, period);
  return {
    total,
    needsTarget: total * (needsPercent / 100),
    wantsTarget: total * (wantsPercent / 100),
    savingsTarget: total * (savingsPercent / 100),
  };
}

export function getTypeStats(
  categories: Category[],
  type: BudgetType,
  target: number,
  period: Period
): TypeStats {
  const typeCats = categories.filter(c => c.type === type);
  const spent = typeCats.reduce((sum, c) => sum + getCategorySpent(c, period), 0);
  const percent = target > 0 ? (spent / target) * 100 : 0;
  return {
    spent,
    target,
    percent,
    isOverBudget: spent > target,
  };
}

export function getDashboardStats(
  categories: Category[],
  settings: AppSettings,
  period: Period
): DashboardStats {
  const periodBudget = getPeriodBudget(settings, period);
  const needs = getTypeStats(categories, 'need', periodBudget.needsTarget, period);
  const wants = getTypeStats(categories, 'want', periodBudget.wantsTarget, period);
  const savings = getTypeStats(categories, 'save', periodBudget.savingsTarget, period);

  const totalSpent = needs.spent + wants.spent + savings.spent;
  const totalSaved = savings.spent;
  const totalRemaining = periodBudget.total - totalSpent;

  const savingsOnTrack = savings.spent >= periodBudget.savingsTarget * 0.9;
  const isOnTrack = !needs.isOverBudget && !wants.isOverBudget && savingsOnTrack;

  return {
    periodBudget,
    totalSpent,
    totalRemaining,
    totalSaved,
    needs,
    wants,
    savings,
    isOnTrack,
  };
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getPeriodLabel(period: Period): string {
  return period.charAt(0).toUpperCase() + period.slice(1);
}

export function getTypeLabel(type: BudgetType): string {
  switch (type) {
    case 'need': return 'Need';
    case 'want': return 'Want';
    case 'save': return 'Savings';
  }
}

export function getTypeColor(type: BudgetType): string {
  switch (type) {
    case 'need': return '#3b82f6';
    case 'want': return '#a855f7';
    case 'save': return '#22c55e';
  }
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'MMM d');
}

// Returns bar segment widths as percentages of total income budget (capped at target %)
export function getRuleBarSegments(
  needs: TypeStats,
  wants: TypeStats,
  savings: TypeStats,
  settings: AppSettings
): { needsWidth: number; wantsWidth: number; savingsWidth: number } {
  const totalIncome = needs.target + wants.target + savings.target;
  if (totalIncome === 0) return { needsWidth: 0, wantsWidth: 0, savingsWidth: 0 };

  const needsWidth = Math.min((needs.spent / totalIncome) * 100, settings.needsPercent);
  const wantsWidth = Math.min((wants.spent / totalIncome) * 100, settings.wantsPercent);
  const savingsWidth = Math.min((savings.spent / totalIncome) * 100, settings.savingsPercent);

  return { needsWidth, wantsWidth, savingsWidth };
}

// Get last 6 months spending per category type
export function getMonthlySpendingHistory(
  categories: Category[],
  monthsBack = 6
): Array<{ month: string; needs: number; wants: number; savings: number }> {
  const results = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    let needs = 0;
    let wants = 0;
    let savings = 0;

    for (const cat of categories) {
      const monthTxns = cat.transactions.filter(t => {
        const d = parseISO(t.date);
        return isWithinInterval(d, { start: monthStart, end: monthEnd });
      });
      const spent = monthTxns.reduce((s, t) => s + t.amount, 0);
      if (cat.type === 'need') needs += spent;
      else if (cat.type === 'want') wants += spent;
      else savings += spent;
    }

    results.push({
      month: format(date, 'MMM'),
      needs,
      wants,
      savings,
    });
  }

  return results;
}

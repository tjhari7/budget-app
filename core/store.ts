import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Category, Transaction, AppSettings, Period } from './types';
import { generateSeedData } from './seed';

export interface BudgetStore {
  categories: Category[];
  settings: AppSettings;
  activePeriod: Period;
  hasSeeded: boolean;

  // Period
  setActivePeriod: (period: Period) => void;

  // Categories
  addCategory: (category: Omit<Category, 'id' | 'transactions' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'transactions' | 'createdAt'>>) => void;
  deleteCategory: (id: string) => void;

  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'tag'>) => void;
  deleteTransaction: (categoryId: string, transactionId: string) => void;

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Data management
  resetAllData: () => void;
  loadFromStorage: (data: StoredState) => void;
  seedIfNeeded: () => void;

  // Serialization
  getSerializable: () => StoredState;
}

export interface StoredState {
  categories: Category[];
  settings: AppSettings;
  activePeriod: Period;
  hasSeeded: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  monthlyIncome: 6000,
  needsPercent: 50,
  wantsPercent: 30,
  savingsPercent: 20,
  currency: 'USD',
};

export const createBudgetStore = (
  persist: (state: StoredState) => void
) =>
  create<BudgetStore>((set, get) => ({
    categories: [],
    settings: { ...DEFAULT_SETTINGS },
    activePeriod: 'monthly',
    hasSeeded: false,

    setActivePeriod: (period) => {
      set({ activePeriod: period });
      persist(get().getSerializable());
    },

    addCategory: (category) => {
      const newCat: Category = {
        ...category,
        id: uuidv4(),
        transactions: [],
        createdAt: new Date().toISOString(),
      };
      set(s => ({ categories: [...s.categories, newCat] }));
      persist(get().getSerializable());
    },

    updateCategory: (id, updates) => {
      set(s => ({
        categories: s.categories.map(c => c.id === id ? { ...c, ...updates } : c),
      }));
      persist(get().getSerializable());
    },

    deleteCategory: (id) => {
      set(s => ({ categories: s.categories.filter(c => c.id !== id) }));
      persist(get().getSerializable());
    },

    addTransaction: (tx) => {
      const category = get().categories.find(c => c.id === tx.categoryId);
      if (!category) return;
      const newTx: Transaction = {
        ...tx,
        id: uuidv4(),
        tag: category.type,
      };
      set(s => ({
        categories: s.categories.map(c =>
          c.id === tx.categoryId
            ? { ...c, transactions: [...c.transactions, newTx] }
            : c
        ),
      }));
      persist(get().getSerializable());
    },

    deleteTransaction: (categoryId, transactionId) => {
      set(s => ({
        categories: s.categories.map(c =>
          c.id === categoryId
            ? { ...c, transactions: c.transactions.filter(t => t.id !== transactionId) }
            : c
        ),
      }));
      persist(get().getSerializable());
    },

    updateSettings: (updates) => {
      set(s => ({ settings: { ...s.settings, ...updates } }));
      persist(get().getSerializable());
    },

    resetAllData: () => {
      const freshSeed = generateSeedData();
      set({
        categories: freshSeed,
        settings: { ...DEFAULT_SETTINGS },
        activePeriod: 'monthly',
        hasSeeded: true,
      });
      persist(get().getSerializable());
    },

    loadFromStorage: (data) => {
      set({
        categories: data.categories,
        settings: data.settings,
        activePeriod: data.activePeriod,
        hasSeeded: data.hasSeeded,
      });
    },

    seedIfNeeded: () => {
      const { hasSeeded } = get();
      if (!hasSeeded) {
        const seedData = generateSeedData();
        set({ categories: seedData, hasSeeded: true });
        persist(get().getSerializable());
      }
    },

    getSerializable: () => {
      const { categories, settings, activePeriod, hasSeeded } = get();
      return { categories, settings, activePeriod, hasSeeded };
    },
  }));

import { createBudgetStore } from '@core/store';
import type { StoredState } from '@core/store';

const STORAGE_KEY = 'budget_app_v1';

function persistToStorage(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist budget state', e);
  }
}

export const useBudgetStore = createBudgetStore(persistToStorage);

export function initStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data: StoredState = JSON.parse(raw);
      useBudgetStore.getState().loadFromStorage(data);
    } else {
      useBudgetStore.getState().seedIfNeeded();
    }
  } catch (e) {
    console.warn('Failed to load budget state', e);
    useBudgetStore.getState().seedIfNeeded();
  }
}

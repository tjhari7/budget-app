import { getDashboardStats, formatCurrency } from '@core/calculations';
import { useBudgetStore } from '../store';

export default function BudgetHeroCard() {
  const categories = useBudgetStore(s => s.categories);
  const settings = useBudgetStore(s => s.settings);
  const activePeriod = useBudgetStore(s => s.activePeriod);

  const stats = getDashboardStats(categories, settings, activePeriod);
  const { periodBudget, totalSpent, totalRemaining, totalSaved } = stats;

  return (
    <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-6">
      <p className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-1">Total Budget</p>
      <p className="text-4xl font-bold text-[#e8e9ef] mb-5">
        {formatCurrency(periodBudget.total, settings.currency)}
      </p>
      <div className="grid grid-cols-3 gap-px bg-[#2a2d3a] rounded-xl overflow-hidden">
        <Chip
          label="SPENT"
          value={formatCurrency(totalSpent, settings.currency)}
          color={totalSpent > periodBudget.total ? '#ef4444' : '#e8e9ef'}
        />
        <Chip
          label="REMAINING"
          value={formatCurrency(totalRemaining, settings.currency)}
          color={totalRemaining >= 0 ? '#22c55e' : '#ef4444'}
        />
        <Chip
          label="SAVED"
          value={formatCurrency(totalSaved, settings.currency)}
          color="#3b82f6"
        />
      </div>
    </div>
  );
}

function Chip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#252836] px-4 py-3 text-center">
      <p className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-semibold" style={{ color }}>{value}</p>
    </div>
  );
}

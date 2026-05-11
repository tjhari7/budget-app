import type { Period } from '@core/types';
import { useBudgetStore } from '../store';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function PeriodTabs() {
  const activePeriod = useBudgetStore(s => s.activePeriod);
  const setActivePeriod = useBudgetStore(s => s.setActivePeriod);

  return (
    <div className="flex gap-2 p-4 border-b border-[#2a2d3a] bg-[#1a1d27]" role="tablist">
      {PERIODS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={activePeriod === value}
          onClick={() => setActivePeriod(value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activePeriod === value
              ? 'bg-[#4f46e5] text-white'
              : 'text-[#4b5563] hover:text-[#9ca3af] hover:bg-[#252836]'
          }`}
          aria-label={`${label} view`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

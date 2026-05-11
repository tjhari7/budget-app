import { useBudgetStore } from '../store';
import { getDashboardStats, getMonthlySpendingHistory } from '@core/calculations';

function HorizontalBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-[#9ca3af] w-16">{label}</span>
      <div className="flex-1 h-3 bg-[#252836] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-[#e8e9ef] w-8 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

function MonthlyChart({ data }: { data: Array<{ month: string; needs: number; wants: number; savings: number }> }) {
  const allVals = data.flatMap(d => [d.needs + d.wants + d.savings]);
  const max = Math.max(...allVals, 1);

  return (
    <div className="flex items-end gap-3 h-40 mt-2">
      {data.map(d => {
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col-reverse justify-start" style={{ height: '120px' }}>
              <div style={{ height: `${(d.needs / max) * 120}px`, backgroundColor: '#3b82f6' }} className="rounded-sm" />
              <div style={{ height: `${(d.wants / max) * 120}px`, backgroundColor: '#a855f7' }} className="rounded-sm" />
              <div style={{ height: `${(d.savings / max) * 120}px`, backgroundColor: '#22c55e' }} className="rounded-sm" />
            </div>
            <span className="text-xs text-[#4b5563]">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Reports() {
  const categories = useBudgetStore(s => s.categories);
  const settings = useBudgetStore(s => s.settings);
  const activePeriod = useBudgetStore(s => s.activePeriod);

  const stats = getDashboardStats(categories, settings, activePeriod);
  const history = getMonthlySpendingHistory(categories, 6);

  const totalSpent = stats.needs.spent + stats.wants.spent + stats.savings.spent;
  const needsPct = Math.round(stats.needs.percent);
  const wantsPct = Math.round(stats.wants.percent);
  const savingsPct = Math.round(stats.savings.percent);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-4 border-b border-[#2a2d3a]">
        <h1 className="text-xl font-bold text-[#e8e9ef]">Reports</h1>
      </div>

      <div className="flex-1 p-6 space-y-4">
        <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-6">
          <h3 className="text-base font-semibold text-[#e8e9ef] mb-5">Spending Breakdown</h3>
          <div className="space-y-4">
            <HorizontalBar label="Needs" value={stats.needs.spent} total={totalSpent} color="#3b82f6" />
            <HorizontalBar label="Wants" value={stats.wants.spent} total={totalSpent} color="#a855f7" />
            <HorizontalBar label="Savings" value={stats.savings.spent} total={totalSpent} color="#22c55e" />
          </div>
        </div>

        <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-6">
          <h3 className="text-base font-semibold text-[#e8e9ef] mb-2">Monthly History</h3>
          <MonthlyChart data={history} />
          <div className="flex gap-6 mt-4 justify-center">
            {[['#3b82f6', 'Needs'], ['#a855f7', 'Wants'], ['#22c55e', 'Savings']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-[#9ca3af]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-6">
          <h3 className="text-base font-semibold text-[#e8e9ef] mb-4">Summary</h3>
          <div className="space-y-2 text-sm text-[#9ca3af] leading-relaxed">
            <p>
              You're spending{' '}
              <span className="font-semibold text-[#3b82f6]">{needsPct}%</span>{' '}
              on needs (target {settings.needsPercent}%).
            </p>
            <p>
              You're spending{' '}
              <span className="font-semibold text-[#a855f7]">{wantsPct}%</span>{' '}
              on wants (target {settings.wantsPercent}%).
            </p>
            <p>
              You're saving{' '}
              <span className="font-semibold text-[#22c55e]">{savingsPct}%</span>{' '}
              (target {settings.savingsPercent}%).
            </p>
          </div>
          <div
            className={`mt-4 p-4 rounded-xl border text-sm font-medium ${
              stats.isOnTrack
                ? 'bg-green-900/10 border-green-500/20 text-[#22c55e]'
                : 'bg-red-900/10 border-red-500/20 text-[#ef4444]'
            }`}
          >
            {stats.isOnTrack
              ? '✓ You are on track with the 50/30/20 rule!'
              : '⚠ Your budget needs attention — check your spending.'}
          </div>
        </div>
      </div>
    </div>
  );
}

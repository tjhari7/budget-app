import { getDashboardStats, getRuleBarSegments } from '@core/calculations';
import { useBudgetStore } from '../store';

export default function RuleBar() {
  const categories = useBudgetStore(s => s.categories);
  const settings = useBudgetStore(s => s.settings);
  const activePeriod = useBudgetStore(s => s.activePeriod);

  const stats = getDashboardStats(categories, settings, activePeriod);
  const { needsWidth, wantsWidth, savingsWidth } = getRuleBarSegments(
    stats.needs, stats.wants, stats.savings, settings
  );

  const needsActual = Math.round(stats.needs.percent);
  const wantsActual = Math.round(stats.wants.percent);
  const savingsActual = Math.round(stats.savings.percent);

  return (
    <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#e8e9ef]">50/30/20 Rule</h3>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            stats.isOnTrack
              ? 'bg-green-900/20 text-[#22c55e]'
              : 'bg-red-900/20 text-[#ef4444]'
          }`}
        >
          {stats.isOnTrack ? 'On track ✓' : 'Needs attention'}
        </span>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden bg-[#252836] gap-0.5 mb-4">
        <div style={{ width: `${needsWidth}%`, backgroundColor: '#3b82f6' }} className="rounded-full transition-all duration-500" />
        <div style={{ width: `${wantsWidth}%`, backgroundColor: '#a855f7' }} className="rounded-full transition-all duration-500" />
        <div style={{ width: `${savingsWidth}%`, backgroundColor: '#22c55e' }} className="rounded-full transition-all duration-500" />
      </div>

      <div className="flex gap-6">
        <LegendItem color="#3b82f6" label="Needs" target={settings.needsPercent} actual={needsActual} />
        <LegendItem color="#a855f7" label="Wants" target={settings.wantsPercent} actual={wantsActual} />
        <LegendItem color="#22c55e" label="Savings" target={settings.savingsPercent} actual={savingsActual} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, target, actual }: { color: string; label: string; target: number; actual: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-[#9ca3af]">{label}</span>
      <span className="text-sm font-semibold text-[#e8e9ef]">{target}%</span>
      <span className="text-xs text-[#4b5563]">({actual}%)</span>
    </div>
  );
}

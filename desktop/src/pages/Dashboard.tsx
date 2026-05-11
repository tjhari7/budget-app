import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useBudgetStore } from '../store';
import { getDashboardStats, formatCurrency } from '@core/calculations';
import type { BudgetType } from '@core/types';
import PeriodTabs from '../components/PeriodTabs';
import BudgetHeroCard from '../components/BudgetHeroCard';
import RuleBar from '../components/RuleBar';
import CategoryCard from '../components/CategoryCard';
import AddCategoryModal from '../components/AddCategoryModal';

const SECTION_CONFIG: { key: BudgetType; label: string; color: string }[] = [
  { key: 'need', label: 'NEEDS', color: '#3b82f6' },
  { key: 'want', label: 'WANTS', color: '#a855f7' },
  { key: 'save', label: 'SAVINGS', color: '#22c55e' },
];

export default function Dashboard() {
  const categories = useBudgetStore(s => s.categories);
  const settings = useBudgetStore(s => s.settings);
  const activePeriod = useBudgetStore(s => s.activePeriod);
  const [showAddCat, setShowAddCat] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<BudgetType, boolean>>({
    need: false, want: false, save: false,
  });

  const stats = getDashboardStats(categories, settings, activePeriod);

  const warnings = [
    stats.needs.isOverBudget && 'Needs are over budget',
    stats.wants.isOverBudget && 'Wants are over budget',
    stats.savings.spent < stats.periodBudget.savingsTarget * 0.9 && 'Savings are below target',
  ].filter(Boolean) as string[];

  const getTypeStats = (key: BudgetType) => {
    if (key === 'need') return { spent: stats.needs.spent, target: stats.periodBudget.needsTarget };
    if (key === 'want') return { spent: stats.wants.spent, target: stats.periodBudget.wantsTarget };
    return { spent: stats.savings.spent, target: stats.periodBudget.savingsTarget };
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2d3a]">
        <h1 className="text-xl font-bold text-[#e8e9ef]">Dashboard</h1>
        <button
          onClick={() => setShowAddCat(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold rounded-xl transition-colors"
          aria-label="Add category"
        >
          + Add Category
        </button>
      </div>

      <div className="sticky top-0 z-10">
        <PeriodTabs />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {warnings.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={16} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#ef4444] space-y-1">
              {warnings.map(w => <p key={w}>{w}</p>)}
            </div>
          </div>
        )}

        <BudgetHeroCard />
        <RuleBar />

        {SECTION_CONFIG.map(section => {
          const { spent, target } = getTypeStats(section.key);
          const isOver = spent > target;
          const sectionCats = categories.filter(c => c.type === section.key);
          const isCollapsed = collapsed[section.key];

          return (
            <div key={section.key} className="space-y-2">
              <button
                onClick={() => setCollapsed(prev => ({ ...prev, [section.key]: !prev[section.key] }))}
                className="w-full flex items-center justify-between px-2 py-2 hover:bg-[#252836] rounded-lg transition-colors"
                aria-label={`Toggle ${section.label} section`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                  <span className="text-xs font-bold text-[#9ca3af] tracking-wider">{section.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${isOver ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                    {formatCurrency(spent, settings.currency)} / {formatCurrency(target, settings.currency)}
                  </span>
                  {isCollapsed ? <ChevronDown size={16} className="text-[#4b5563]" /> : <ChevronUp size={16} className="text-[#4b5563]" />}
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-2">
                  {sectionCats.length === 0 ? (
                    <div className="bg-[#1a1d27] border border-dashed border-[#2a2d3a] rounded-xl p-6 text-center">
                      <p className="text-sm text-[#4b5563]">No categories yet. Tap + to add.</p>
                    </div>
                  ) : (
                    sectionCats.map(cat => (
                      <CategoryCard key={cat.id} category={cat} period={activePeriod} currency={settings.currency} />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddCategoryModal open={showAddCat} onClose={() => setShowAddCat(false)} />
    </div>
  );
}

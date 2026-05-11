import { useNavigate } from 'react-router-dom';
import { getCategoryStats, formatCurrency, getTypeLabel, getTypeColor } from '@core/calculations';
import type { Category, Period } from '@core/types';

interface Props {
  category: Category;
  period: Period;
  currency: string;
}

export default function CategoryCard({ category, period, currency }: Props) {
  const navigate = useNavigate();
  const stats = getCategoryStats(category, period);
  const { spent, limit, percentUsed, isOverBudget } = stats;
  const typeColor = getTypeColor(category.type);

  return (
    <div
      onClick={() => navigate(`/category/${category.id}`)}
      className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-4 cursor-pointer hover:bg-[#2e3144] transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/category/${category.id}`)}
      aria-label={`${category.name} category`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: category.color + '26' }}
        >
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[#e8e9ef] truncate">{category.name}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0"
              style={{ backgroundColor: typeColor + '20', color: typeColor }}
            >
              {getTypeLabel(category.type)}
            </span>
          </div>
          <span className="text-xs font-medium" style={{ color: isOverBudget ? '#ef4444' : '#22c55e' }}>
            {isOverBudget ? '⚠ Over budget' : `${Math.round(percentUsed)}% used`}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-bold" style={{ color: isOverBudget ? '#ef4444' : '#22c55e' }}>
            {formatCurrency(spent, currency)}
          </p>
          <p className="text-xs text-[#3b82f6]">{formatCurrency(limit, currency)}</p>
        </div>
      </div>
      <div className="h-1.5 bg-[#252836] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentUsed, 100)}%`,
            backgroundColor: isOverBudget ? '#ef4444' : category.color,
          }}
        />
      </div>
    </div>
  );
}

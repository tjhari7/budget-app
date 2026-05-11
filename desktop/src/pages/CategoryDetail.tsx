import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useBudgetStore } from '../store';
import {
  getCategoryStats, formatCurrency, formatDate, getTypeLabel, getTypeColor,
} from '@core/calculations';
import AddCategoryModal from '../components/AddCategoryModal';
import AddTransactionModal from '../components/AddTransactionModal';

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categories = useBudgetStore(s => s.categories);
  const settings = useBudgetStore(s => s.settings);
  const activePeriod = useBudgetStore(s => s.activePeriod);
  const deleteTransaction = useBudgetStore(s => s.deleteTransaction);

  const [showEdit, setShowEdit] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [confirmDeleteTx, setConfirmDeleteTx] = useState<string | null>(null);

  const category = categories.find(c => c.id === id);

  if (!category) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#4b5563] mb-4">Category not found.</p>
          <button onClick={() => navigate('/')} className="text-[#4f46e5] text-sm">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const stats = getCategoryStats(category, activePeriod);
  const typeColor = getTypeColor(category.type);
  const sortedTxns = [...category.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteTx = (txId: string) => {
    if (confirmDeleteTx === txId) {
      deleteTransaction(category.id, txId);
      setConfirmDeleteTx(null);
    } else {
      setConfirmDeleteTx(txId);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2d3a]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-[#9ca3af] hover:text-[#e8e9ef] hover:bg-[#252836] rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-xl font-bold text-[#e8e9ef]">{category.name}</h1>
        <button
          onClick={() => setShowEdit(true)}
          className="p-2 text-[#9ca3af] hover:text-[#e8e9ef] hover:bg-[#252836] rounded-lg transition-colors"
          aria-label="Edit category"
        >
          <Pencil size={18} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-4 max-w-2xl">
        <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-6 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: category.color + '26' }}
          >
            {category.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#e8e9ef]">{category.name}</h2>
            <span
              className="inline-block mt-1 px-3 py-1 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: typeColor + '20', color: typeColor }}
            >
              {getTypeLabel(category.type)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="SPENT" value={formatCurrency(stats.spent, settings.currency)} color={stats.isOverBudget ? '#ef4444' : '#22c55e'} />
          <StatCard label="LIMIT" value={formatCurrency(stats.limit, settings.currency)} color="#3b82f6" />
          <StatCard label="REMAINING" value={formatCurrency(stats.remaining, settings.currency)} color={stats.remaining >= 0 ? '#22c55e' : '#ef4444'} />
        </div>

        <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[#9ca3af]">
              {stats.isOverBudget ? 'Over budget' : `${Math.round(stats.percentUsed)}% used`}
            </span>
            <span className="text-sm font-semibold" style={{ color: stats.isOverBudget ? '#ef4444' : '#22c55e' }}>
              {Math.round(stats.percentUsed)}%
            </span>
          </div>
          <div className="h-3 bg-[#252836] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(stats.percentUsed, 100)}%`,
                backgroundColor: stats.isOverBudget ? '#ef4444' : category.color,
              }}
            />
          </div>
        </div>

        <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider">Transactions</h3>
            <button
              onClick={() => setShowAddTx(true)}
              className="flex items-center gap-1.5 text-sm text-[#4f46e5] hover:text-[#4338ca] font-medium"
              aria-label="Add transaction"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {sortedTxns.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#4b5563]">No transactions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#252836]">
              {sortedTxns.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1">
                    <p className="text-sm text-[#e8e9ef]">{tx.note || 'No note'}</p>
                    <p className="text-xs text-[#4b5563] mt-0.5">{formatDate(tx.date)}</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: stats.isOverBudget ? '#ef4444' : '#e8e9ef' }}>
                    {formatCurrency(tx.amount, settings.currency)}
                  </p>
                  <button
                    onClick={() => handleDeleteTx(tx.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmDeleteTx === tx.id
                        ? 'bg-red-900/30 text-[#ef4444]'
                        : 'text-[#4b5563] hover:text-[#ef4444] hover:bg-red-900/20'
                    }`}
                    aria-label={confirmDeleteTx === tx.id ? 'Confirm delete' : 'Delete transaction'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddTx(true)}
          className="w-full flex items-center justify-center gap-2 py-4 border border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/10 font-semibold rounded-xl transition-colors"
          aria-label="Add transaction"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      <AddCategoryModal open={showEdit} onClose={() => setShowEdit(false)} editCategory={category} />
      <AddTransactionModal open={showAddTx} onClose={() => setShowAddTx(false)} defaultCategoryId={category.id} />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-4 text-center">
      <p className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-base font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

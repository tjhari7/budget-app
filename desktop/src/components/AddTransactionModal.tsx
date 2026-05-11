import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useBudgetStore } from '../store';
import { getTypeLabel, getTypeColor } from '@core/calculations';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
}

export default function AddTransactionModal({ open, onClose, defaultCategoryId }: Props) {
  const categories = useBudgetStore(s => s.categories);
  const addTransaction = useBudgetStore(s => s.addTransaction);

  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (open) {
      setCategoryId(defaultCategoryId ?? categories[0]?.id ?? '');
      setAmount(''); setNote(''); setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [open, defaultCategoryId, categories]);

  if (!open) return null;

  const selectedCategory = categories.find(c => c.id === categoryId);
  const typeColor = selectedCategory ? getTypeColor(selectedCategory.type) : '#9ca3af';

  const handleSave = () => {
    const parsed = parseFloat(amount);
    if (!categoryId || isNaN(parsed) || parsed <= 0) return;
    addTransaction({ categoryId, amount: parsed, note: note.trim(), date: new Date(date).toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-[#1a1d27] rounded-2xl border border-[#2a2d3a] w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[#2a2d3a]">
          <h2 className="text-lg font-bold text-[#e8e9ef]">Add Transaction</h2>
          <button onClick={onClose} className="text-[#4b5563] hover:text-[#9ca3af]" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {categories.length === 0 ? (
            <p className="text-[#4b5563] text-sm text-center py-4">No categories yet. Add a category first.</p>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 py-3 text-[#e8e9ef] text-sm focus:outline-none focus:border-[#4f46e5]"
                  aria-label="Category"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div
                  className="inline-flex px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: typeColor + '20', color: typeColor }}
                >
                  Tag: {getTypeLabel(selectedCategory.type)}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
                  Amount
                </label>
                <div className="flex items-center bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 focus-within:border-[#4f46e5]">
                  <span className="text-[#9ca3af] text-sm mr-1">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 py-3 bg-transparent text-[#e8e9ef] text-sm focus:outline-none"
                    aria-label="Amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="What was this for?"
                  className="w-full bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 py-3 text-[#e8e9ef] text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#4f46e5]"
                  aria-label="Note"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 py-3 text-[#e8e9ef] text-sm focus:outline-none focus:border-[#4f46e5]"
                  aria-label="Date"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!categoryId || !amount}
                className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                aria-label="Save transaction"
              >
                Save Transaction
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

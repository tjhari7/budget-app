import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useBudgetStore } from '../store';
import type { BudgetType, Category } from '@core/types';
import { ICON_OPTIONS, COLOR_OPTIONS } from '@core/seed';

interface Props {
  open: boolean;
  onClose: () => void;
  editCategory?: Category;
}

const TYPE_CONFIG: { value: BudgetType; label: string; color: string }[] = [
  { value: 'need', label: 'Need', color: '#3b82f6' },
  { value: 'want', label: 'Want', color: '#a855f7' },
  { value: 'save', label: 'Savings', color: '#22c55e' },
];

export default function AddCategoryModal({ open, onClose, editCategory }: Props) {
  const addCategory = useBudgetStore(s => s.addCategory);
  const updateCategory = useBudgetStore(s => s.updateCategory);
  const deleteCategory = useBudgetStore(s => s.deleteCategory);

  const [name, setName] = useState('');
  const [type, setType] = useState<BudgetType>('need');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('🏠');
  const [color, setColor] = useState('#3b82f6');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open && editCategory) {
      setName(editCategory.name);
      setType(editCategory.type);
      setLimit(String(editCategory.monthlyLimit));
      setIcon(editCategory.icon);
      setColor(editCategory.color);
    } else if (open) {
      setName(''); setType('need'); setLimit(''); setIcon('🏠'); setColor('#3b82f6');
    }
    setConfirmDelete(false);
  }, [open, editCategory]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim() || !limit) return;
    const monthlyLimit = parseFloat(limit);
    if (isNaN(monthlyLimit) || monthlyLimit <= 0) return;
    if (editCategory) {
      updateCategory(editCategory.id, { name: name.trim(), type, monthlyLimit, icon, color });
    } else {
      addCategory({ name: name.trim(), type, monthlyLimit, icon, color });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editCategory) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteCategory(editCategory.id);
    onClose();
  };

  const selectedType = TYPE_CONFIG.find(t => t.value === type)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-[#1a1d27] rounded-2xl border border-[#2a2d3a] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#2a2d3a]">
          <h2 className="text-lg font-bold text-[#e8e9ef]">
            {editCategory ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="text-[#4b5563] hover:text-[#9ca3af]" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rent"
              className="w-full bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 py-3 text-[#e8e9ef] text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#4f46e5]"
              aria-label="Category name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {TYPE_CONFIG.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors"
                  style={type === t.value
                    ? { backgroundColor: t.color, borderColor: t.color, color: '#ffffff' }
                    : { backgroundColor: '#252836', borderColor: '#2a2d3a', color: '#9ca3af' }
                  }
                  aria-label={`Type: ${t.label}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
              Monthly Limit
            </label>
            <div className="flex items-center bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 focus-within:border-[#4f46e5]">
              <span className="text-[#9ca3af] text-sm mr-1">$</span>
              <input
                type="number"
                value={limit}
                onChange={e => setLimit(e.target.value)}
                placeholder="0"
                min="0"
                className="flex-1 py-3 bg-transparent text-[#e8e9ef] text-sm focus:outline-none"
                aria-label="Monthly limit"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-colors ${icon === ic ? 'bg-[#4f46e5]' : 'bg-[#252836] hover:bg-[#2e3144]'}`}
                  aria-label={`Icon ${ic}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `2px solid #ffffff` : 'none',
                    outlineOffset: '2px',
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#252836] rounded-lg p-4 text-sm text-[#9ca3af] leading-relaxed">
            💡 50/30/20 Rule: Needs = 50%, Wants = 30%, Savings = 20% of income.
            This category counts toward your{' '}
            <span style={{ color: selectedType.color }} className="font-semibold">
              {selectedType.label}
            </span>{' '}
            bucket.
          </div>

          <button
            onClick={handleSave}
            disabled={!name.trim() || !limit}
            className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            aria-label="Save category"
          >
            Save Category
          </button>

          {editCategory && (
            <button
              onClick={handleDelete}
              className="w-full py-3 border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 font-semibold rounded-xl transition-colors"
              aria-label="Delete category"
            >
              {confirmDelete ? 'Confirm Delete' : 'Delete Category'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, Plus } from 'lucide-react';
import { useState } from 'react';
import AddCategoryModal from '../components/AddCategoryModal';
import AddTransactionModal from '../components/AddTransactionModal';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/reports', label: 'Reports', Icon: BarChart3 },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export default function Sidebar() {
  const [showCat, setShowCat] = useState(false);
  const [showTx, setShowTx] = useState(false);

  return (
    <>
      <aside className="w-60 min-h-screen bg-[#1a1d27] border-r border-[#2a2d3a] flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-[#2a2d3a]">
          <h1 className="text-xl font-bold text-[#e8e9ef]">💰 Budget</h1>
          <p className="text-xs text-[#4b5563] mt-1">50/30/20 Tracker</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#4f46e5] text-white'
                    : 'text-[#9ca3af] hover:bg-[#252836] hover:text-[#e8e9ef]'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-[#2a2d3a]">
          <button
            onClick={() => setShowCat(true)}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#252836] hover:bg-[#2e3144] text-[#e8e9ef] rounded-lg text-sm font-medium transition-colors"
            aria-label="Add category"
          >
            <Plus size={16} />
            Add Category
          </button>
          <button
            onClick={() => setShowTx(true)}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-sm font-medium transition-colors"
            aria-label="Add transaction"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </aside>

      <AddCategoryModal open={showCat} onClose={() => setShowCat(false)} />
      <AddTransactionModal open={showTx} onClose={() => setShowTx(false)} />
    </>
  );
}

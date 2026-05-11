import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/reports', label: 'Reports', Icon: BarChart3 },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export default function MobileNav() {
  return (
    <nav className="flex items-center gap-1 px-4 py-3 bg-[#1a1d27] border-b border-[#2a2d3a]">
      <span className="text-base font-bold text-[#e8e9ef] mr-4">💰 Budget</span>
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#4f46e5] text-white'
                : 'text-[#9ca3af] hover:bg-[#252836] hover:text-[#e8e9ef]'
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

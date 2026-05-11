import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { initStore } from './store';
import Sidebar from './layouts/Sidebar';
import MobileNav from './layouts/MobileNav';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import CategoryDetail from './pages/CategoryDetail';

function Layout() {
  // Use CSS media query via class
  return (
    <div className="flex w-full min-h-screen bg-[#0f1117]">
      {/* Sidebar for md+ screens */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile nav for < md */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initStore();
  }, []);

  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}

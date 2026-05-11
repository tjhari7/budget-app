import { useState } from 'react';
import { useBudgetStore } from '../store';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'];

export default function Settings() {
  const settings = useBudgetStore(s => s.settings);
  const updateSettings = useBudgetStore(s => s.updateSettings);
  const resetAllData = useBudgetStore(s => s.resetAllData);

  const [income, setIncome] = useState(String(settings.monthlyIncome));
  const [needs, setNeeds] = useState(String(settings.needsPercent));
  const [wants, setWants] = useState(String(settings.wantsPercent));
  const [savings, setSavings] = useState(String(settings.savingsPercent));
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const pctSum = (parseFloat(needs) || 0) + (parseFloat(wants) || 0) + (parseFloat(savings) || 0);

  const handleSave = () => {
    const incomeVal = parseFloat(income);
    const needsVal = parseFloat(needs);
    const wantsVal = parseFloat(wants);
    const savingsVal = parseFloat(savings);
    if (!incomeVal || isNaN(incomeVal) || incomeVal <= 0) return;
    if (Math.round(needsVal + wantsVal + savingsVal) !== 100) return;
    updateSettings({ monthlyIncome: incomeVal, needsPercent: needsVal, wantsPercent: wantsVal, savingsPercent: savingsVal });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAllData();
    setConfirmReset(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-4 border-b border-[#2a2d3a]">
        <h1 className="text-xl font-bold text-[#e8e9ef]">Settings</h1>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-xl">
        <Section title="Income">
          <label className="block text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-2">
            Monthly Income
          </label>
          <div className="flex items-center bg-[#252836] border border-[#2a2d3a] rounded-lg px-4 focus-within:border-[#4f46e5] w-full max-w-xs">
            <span className="text-[#9ca3af] text-sm mr-1">$</span>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value)}
              className="flex-1 py-3 bg-transparent text-[#e8e9ef] text-sm focus:outline-none"
              aria-label="Monthly income"
            />
          </div>
        </Section>

        <Section title="50/30/20 Rule">
          <div className="space-y-4">
            <PctRow label="Needs" value={needs} onChange={setNeeds} color="#3b82f6" />
            <PctRow label="Wants" value={wants} onChange={setWants} color="#a855f7" />
            <PctRow label="Savings" value={savings} onChange={setSavings} color="#22c55e" />
            <div className={`flex justify-between pt-3 border-t ${Math.round(pctSum) === 100 ? 'border-green-500/20' : 'border-red-500/20'}`}>
              <span className="text-sm font-semibold text-[#9ca3af]">Total</span>
              <span className={`text-sm font-bold ${Math.round(pctSum) === 100 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {Math.round(pctSum)}%{Math.round(pctSum) !== 100 ? ' (must equal 100%)' : ' ✓'}
              </span>
            </div>
          </div>
        </Section>

        <Section title="Currency">
          <div className="flex gap-2 flex-wrap">
            {CURRENCIES.map(c => (
              <button
                key={c}
                onClick={() => updateSettings({ currency: c })}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  settings.currency === c
                    ? 'bg-[#4f46e5] border-[#4f46e5] text-white'
                    : 'bg-[#252836] border-[#2a2d3a] text-[#9ca3af] hover:border-[#4f46e5]'
                }`}
                aria-label={`Currency: ${c}`}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>

        <button
          onClick={handleSave}
          disabled={Math.round(pctSum) !== 100}
          className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          aria-label="Save settings"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>

        <Section title="Danger Zone">
          <p className="text-sm text-[#4b5563] mb-4">
            Resetting will delete all data and restore the default seed data.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 font-semibold rounded-xl transition-colors text-sm"
            aria-label="Reset all data"
          >
            {confirmReset ? 'Are you sure? Click again to confirm' : 'Reset All Data'}
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3a] p-6">
      <h3 className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PctRow({ label, value, onChange, color }: { label: string; value: string; onChange: (v: string) => void; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-[#9ca3af] flex-1">{label} %</span>
      <div className="flex items-center bg-[#252836] border border-[#2a2d3a] rounded-lg px-3 focus-within:border-[#4f46e5]">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-16 py-2 bg-transparent text-[#e8e9ef] text-sm text-right focus:outline-none"
          aria-label={`${label} percentage`}
        />
        <span className="text-[#4b5563] text-sm ml-1">%</span>
      </div>
    </div>
  );
}

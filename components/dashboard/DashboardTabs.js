import { useState } from 'react';

const TABS = [
  { id: 'overview', label: 'OVERVIEW', enabled: true },
  { id: 'roster', label: 'ROSTER', enabled: true },
  { id: 'trades', label: 'TRADES', enabled: true },
  { id: 'scouting', label: 'SCOUTING', enabled: false },
  { id: 'matchups', label: 'MATCHUPS', enabled: false },
  { id: 'trends', label: 'TRENDS', enabled: false },
];

export default function DashboardTabs({ initialTab = 'overview', onChange }) {
  const [active, setActive] = useState(initialTab);

  const handleClick = (id) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className="h-12 w-full flex rounded-lg rounded-tr-lg rounded-b-none overflow-hidden border border-pb_darkgray border-b-0 bg-pb_darkgray px-0.5 pt-0.5">
      {TABS.map(({ id, label, enabled }, idx) => (
        <button
          key={id}
          disabled={!enabled}
          className={`
            flex-1 h-full flex items-center justify-center text-sm font-semibold tracking-wider uppercase
            focus:outline-none select-none transition-colors
            ${active === id
              ? 'bg-pb_paperwhite text-pb_darkgray -mb-px border border-pb_darkgray border-b-0 rounded-tl-lg rounded-tr-lg'
              : 'text-white hover:bg-pb_mddarkgray border border-transparent'}
            ${idx === 0 ? 'rounded-tl-lg rounded-tr-lg' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pb_mddarkgray
          `}
          onClick={() => handleClick(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
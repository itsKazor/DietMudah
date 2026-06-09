import React from 'react';

const GlassIcon = ({ filled }) => (
  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 2L5 24C5.1 25.1 6 26 7.1 26H16.9C18 26 18.9 25.1 19 24L21 2" 
      stroke={filled ? "#52B788" : "#9CA3AF"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 2H22" 
      stroke={filled ? "#52B788" : "#9CA3AF"} 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {filled && (
      <path 
        d="M4.2 9H19.8L18.5 24C18.4 25.1 17.5 26 16.4 26H7.6C6.5 26 5.6 25.1 5.5 24L4.2 9Z" 
        fill="#52B788" 
        fillOpacity="0.4"
      />
    )}
  </svg>
);

export default function WaterTracker({ current = 0, target = 8, onAdd, onRemove }) {
  const handleToggle = (index) => {
    // Basic toggle logic: if tapping a filled glass, assume removal (or decrease)
    // if tapping an empty glass, assume addition
    if (index < current) {
      if (onRemove) onRemove();
    } else {
      if (onAdd) onAdd();
    }
  };

  const totalGlasses = Math.max(target, current);
  const glasses = Array.from({ length: totalGlasses });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-text-primary">Minum Air</h3>
        <span className="text-sm font-semibold text-primary-dark tabular-nums">{current} / {target} gelas</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {glasses.map((_, i) => (
          <button 
            key={i} 
            onClick={() => handleToggle(i)}
            className="active:scale-90 transition-transform p-1"
            aria-label={i < current ? 'Kurangi air' : 'Tambah air'}
          >
            <GlassIcon filled={i < current} />
          </button>
        ))}
      </div>
    </div>
  );
}

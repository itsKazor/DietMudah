import React from 'react';
import { Trash2 } from 'lucide-react';

export default function FoodCard({ entry, onDelete, onEdit }) {
  if (!entry) return null;

  const handleDelete = () => {
    if (window.confirm(`Hapus ${entry.name} dari log?`)) {
      onDelete(entry.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-text-primary">{entry.name}</h4>
          {entry.confidence === 'low' && (
            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Estimasi
            </span>
          )}
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-[#4EA8DE] font-medium bg-[#4EA8DE]/10 px-2 py-0.5 rounded-full tabular-nums">{entry.protein}g P</span>
          <span className="text-[#F4A261] font-medium bg-[#F4A261]/10 px-2 py-0.5 rounded-full tabular-nums">{entry.carbs}g K</span>
          <span className="text-[#E76F51] font-medium bg-[#E76F51]/10 px-2 py-0.5 rounded-full tabular-nums">{entry.fat}g L</span>
        </div>
        <div className="text-xs text-text-secondary mt-1">{entry.portion}</div>
      </div>
      
      <div className="flex flex-col items-end gap-2 ml-4">
        <div className="text-calorie font-bold text-lg tabular-nums">{Math.round(entry.calories)} <span className="text-xs font-normal text-text-secondary">kcal</span></div>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-danger transition-colors p-1"
          aria-label="Hapus"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

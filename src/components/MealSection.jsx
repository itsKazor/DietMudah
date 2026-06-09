import React from 'react';
import { Plus } from 'lucide-react';
import FoodCard from './FoodCard';

export default function MealSection({ meal, entries = [], onAdd, onDelete }) {
  const title = meal.charAt(0).toUpperCase() + meal.slice(1);
  const totalCalories = entries.reduce((sum, item) => sum + (item.calories || 0), 0);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-3">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <span className="text-sm font-semibold text-primary-dark tabular-nums">{Math.round(totalCalories)} kcal</span>
      </div>
      
      {entries.length === 0 ? (
        <div className="bg-white/50 border border-dashed border-gray-300 rounded-2xl p-4 text-center mb-3">
          <span className="text-sm text-text-muted">Belum ada makanan</span>
        </div>
      ) : (
        entries.map(entry => (
          <FoodCard 
            key={entry.id} 
            entry={entry} 
            onDelete={onDelete} 
          />
        ))
      )}

      <button 
        onClick={() => onAdd(meal)}
        className="w-full py-3 rounded-xl border border-primary-light text-primary-dark font-medium flex items-center justify-center gap-2 active:bg-primary-tint transition-colors"
      >
        <Plus size={20} />
        Tambah Makanan
      </button>
    </div>
  );
}

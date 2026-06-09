import React, { useState } from 'react';
import { useLogStore } from '../store/logStore';
import { useProfileStore } from '../store/profileStore';
import { searchFoods } from '../services/foodDatabase';
import { Search, X, Plus } from 'lucide-react';
import DateNav from '../components/DateNav';
import MealSection from '../components/MealSection';
import BottomNav from '../components/BottomNav';

export default function Log() {
  const profile = useProfileStore();
  const { 
    selectedDate, 
    setSelectedDate, 
    entries, 
    deleteEntry, 
    addEntry 
  } = useLogStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchMeal, setActiveSearchMeal] = useState('sarapan');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const summary = entries.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getEntriesByMeal = (meal) => entries.filter(e => e.meal === meal);

  const handleAddMeal = (meal) => {
    setActiveSearchMeal(meal);
    setIsSearchOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchResults(searchFoods(q));
  };

  const addManualEntry = (food) => {
    const entry = {
      id: crypto.randomUUID(),
      meal: activeSearchMeal,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      portion: food.portionSize,
      source: 'database',
      timestamp: Date.now()
    };
    addEntry(entry);
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface pb-36 relative">
      <div className="p-5 space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Log Makanan</h1>
        
        <DateNav selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className="space-y-2">
          {['sarapan', 'siang', 'malam', 'snack'].map(meal => (
            <MealSection 
              key={meal}
              meal={meal} 
              entries={getEntriesByMeal(meal)} 
              onAdd={handleAddMeal}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      </div>

      {/* Sticky Total Bar */}
      <div className="fixed bottom-16 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-200 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-text-primary">Total Kalori</span>
          <span className="font-bold text-calorie tabular-nums">
            {Math.round(summary.calories)} <span className="text-sm font-normal text-text-secondary">/ {profile.targetCalories} kcal</span>
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${summary.calories > profile.targetCalories ? 'bg-danger' : 'bg-success'}`}
            style={{ width: `${Math.min((summary.calories / (profile.targetCalories || 1)) * 100, 100)}%` }}
          />
        </div>
      </div>

      <BottomNav />

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 max-w-[430px] mx-auto bg-surface z-50 flex flex-col animate-in slide-in-from-bottom-full">
          <div className="bg-white p-4 flex gap-3 items-center border-b border-gray-100 shadow-sm">
            <button onClick={() => setIsSearchOpen(false)} className="p-2 -ml-2 text-text-secondary active:scale-95 transition-transform">
              <X size={24} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder={`Cari makanan untuk ${activeSearchMeal}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-light transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {searchQuery && searchResults.length === 0 ? (
              <div className="text-center text-text-muted mt-10">
                <p>Makanan tidak ditemukan.</p>
                <p className="text-sm mt-1">Coba kata kunci lain atau gunakan fitur Scan AI.</p>
              </div>
            ) : (
              searchResults.map(food => (
                <div key={food.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:bg-gray-50 transition-colors" onClick={() => addManualEntry(food)}>
                  <div>
                    <h4 className="font-semibold text-text-primary">{food.name}</h4>
                    <p className="text-xs text-text-secondary mt-1">{food.portionSize} • {food.calories} kcal</p>
                  </div>
                  <button className="text-primary-dark p-2 bg-primary-tint rounded-full">
                    <Plus size={20} />
                  </button>
                </div>
              ))
            )}
            
            {!searchQuery && (
              <div className="text-center text-text-muted mt-10">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>Ketik nama makanan untuk mencari database.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

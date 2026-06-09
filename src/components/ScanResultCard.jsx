import React from 'react';

export default function ScanResultCard({ 
  result, 
  portionMultiplier = 1.0, 
  selectedMeal = 'sarapan',
  onPortionChange, 
  onMealChange, 
  onSave, 
  onEditManual 
}) {
  if (!result) return null;

  const adjustedCalories = Math.round(result.calories * portionMultiplier);
  const adjustedProtein = (result.protein * portionMultiplier).toFixed(1);
  const adjustedCarbs = (result.carbs * portionMultiplier).toFixed(1);
  const adjustedFat = (result.fat * portionMultiplier).toFixed(1);

  const portions = [0.5, 0.75, 1.0, 1.5, 2.0, 3.0];
  const meals = ['sarapan', 'siang', 'malam', 'snack'];

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full max-w-[430px] mx-auto absolute bottom-0 left-0 right-0 z-50">
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">{result.name}</h2>
          <p className="text-text-secondary text-sm">Porsi asli: {result.portion}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-calorie tabular-nums">
            {adjustedCalories}
          </div>
          <div className="text-sm text-text-secondary">kcal</div>
        </div>
      </div>

      {/* Macro Chips */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-[#4EA8DE]/10 rounded-xl p-3 text-center">
          <div className="text-[#4EA8DE] font-bold text-lg tabular-nums">{adjustedProtein}g</div>
          <div className="text-xs text-[#4EA8DE]">Protein</div>
        </div>
        <div className="flex-1 bg-[#F4A261]/10 rounded-xl p-3 text-center">
          <div className="text-[#F4A261] font-bold text-lg tabular-nums">{adjustedCarbs}g</div>
          <div className="text-xs text-[#F4A261]">Karbo</div>
        </div>
        <div className="flex-1 bg-[#E76F51]/10 rounded-xl p-3 text-center">
          <div className="text-[#E76F51] font-bold text-lg tabular-nums">{adjustedFat}g</div>
          <div className="text-xs text-[#E76F51]">Lemak</div>
        </div>
      </div>

      {/* Portion Selector */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3">Ukuran Porsi</h4>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {portions.map(p => (
            <button
              key={p}
              onClick={() => onPortionChange(p)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                portionMultiplier === p 
                  ? 'bg-primary-dark text-white' 
                  : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              }`}
            >
              {p}x
            </button>
          ))}
        </div>
      </div>

      {/* Meal Selector */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold mb-3">Simpan ke Waktu Makan</h4>
        <div className="grid grid-cols-2 gap-2">
          {meals.map(meal => (
            <button
              key={meal}
              onClick={() => onMealChange(meal)}
              className={`py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                selectedMeal === meal 
                  ? 'bg-primary-light text-white' 
                  : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              }`}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={onSave}
        className="w-full bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform mb-3"
      >
        Simpan ke Log
      </button>

      <div className="text-center">
        <button 
          onClick={onEditManual}
          className="text-sm text-text-muted hover:text-primary-dark transition-colors"
        >
          Edit Manual
        </button>
      </div>
    </div>
  );
}

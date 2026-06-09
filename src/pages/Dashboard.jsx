import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { useLogStore } from '../store/logStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatDateDisplay, toDateString } from '../utils/dateUtils';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar';
import MealSection from '../components/MealSection';
import WaterTracker from '../components/WaterTracker';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = useProfileStore();
  const { 
    selectedDate, 
    entries, 
    waterCount, 
    getTodaySummary, 
    deleteEntry, 
    setWater,
    setSelectedDate 
  } = useLogStore();
  const waterTarget = useSettingsStore(state => state.waterTarget);

  useEffect(() => {
    // Pastikan di dashboard selalu melihat hari ini
    setSelectedDate(new Date());
  }, [setSelectedDate]);

  const summary = getTodaySummary();
  const dateStr = toDateString(selectedDate);
  
  const handleAddMeal = (meal) => {
    // Arahkan ke log page, atau biarkan scan lewat FAB
    navigate(`/log`);
  };

  const getEntriesByMeal = (meal) => entries.filter(e => e.meal === meal);

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <div className="bg-primary-dark pt-8 pb-10 px-6 rounded-b-[40px] shadow-[0_10px_20px_rgba(27,67,50,0.1)] text-white">
        <h1 className="text-2xl font-bold mb-1">Halo, {profile.name || 'Sobat'}!</h1>
        <p className="text-primary-tint font-medium opacity-90">{formatDateDisplay(selectedDate)}</p>
      </div>

      <div className="px-5 -mt-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-center mb-6 mt-2">
            <CalorieRing consumed={summary.totalCalories} target={profile.targetCalories} size={220} />
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-5">
            <MacroBar label="Protein" current={summary.totalProtein} target={profile.targetProtein} color="#4EA8DE" />
            <MacroBar label="Karbo" current={summary.totalCarbs} target={profile.targetCarbs} color="#F4A261" />
            <MacroBar label="Lemak" current={summary.totalFat} target={profile.targetFat} color="#E76F51" />
          </div>
        </div>

        {/* Meal Sections */}
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

        {/* Water Tracker */}
        <WaterTracker 
          current={waterCount} 
          target={waterTarget} 
          onAdd={() => setWater(dateStr, waterCount + 1)}
          onRemove={() => setWater(dateStr, Math.max(0, waterCount - 1))}
        />
      </div>

      <BottomNav />
    </div>
  );
}

import { create } from 'zustand';
import { getLog, saveLog, getWater, saveWater } from '../utils/storage';
import { toDateString, getWeekDates } from '../utils/dateUtils';

export const useLogStore = create((set, get) => ({
  selectedDate: new Date(),
  entries: [],
  waterCount: 0,

  setSelectedDate: (date) => {
    const dateStr = toDateString(date);
    set({ 
      selectedDate: date,
      entries: getLog(dateStr),
      waterCount: getWater(dateStr)
    });
  },

  getEntries: (dateStr) => {
    return getLog(dateStr);
  },

  addEntry: (entry) => {
    const state = get();
    const dateStr = toDateString(state.selectedDate);
    const newEntries = [...state.entries, entry];
    saveLog(dateStr, newEntries);
    set({ entries: newEntries });
  },

  updateEntry: (id, data) => {
    const state = get();
    const dateStr = toDateString(state.selectedDate);
    const newEntries = state.entries.map(e => e.id === id ? { ...e, ...data } : e);
    saveLog(dateStr, newEntries);
    set({ entries: newEntries });
  },

  deleteEntry: (id) => {
    const state = get();
    const dateStr = toDateString(state.selectedDate);
    const newEntries = state.entries.filter(e => e.id !== id);
    saveLog(dateStr, newEntries);
    set({ entries: newEntries });
  },

  getWater: (dateStr) => {
    return getWater(dateStr);
  },

  setWater: (dateStr, count) => {
    saveWater(dateStr, count);
    const state = get();
    if (dateStr === toDateString(state.selectedDate)) {
      set({ waterCount: count });
    }
  },

  getTodaySummary: () => {
    const state = get();
    const summary = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
    state.entries.forEach(e => {
      summary.totalCalories += e.calories || 0;
      summary.totalProtein += e.protein || 0;
      summary.totalCarbs += e.carbs || 0;
      summary.totalFat += e.fat || 0;
    });
    return summary;
  },

  getWeekData: () => {
    const state = get();
    const weekDates = getWeekDates(state.selectedDate);
    return weekDates.map(date => {
      const dateStr = toDateString(date);
      const dayEntries = getLog(dateStr);
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      
      dayEntries.forEach(e => {
        totalCalories += e.calories || 0;
        totalProtein += e.protein || 0;
        totalCarbs += e.carbs || 0;
        totalFat += e.fat || 0;
      });

      return {
        date,
        dateStr,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
      };
    });
  }
}));

// Initialize store with today's data
useLogStore.getState().setSelectedDate(new Date());

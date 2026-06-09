import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calcBMR, calcTDEE, calcTargets } from '../services/calorieCalc';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      name: '',
      gender: 'male',
      age: 0,
      weight: 0,
      height: 0,
      activityLevel: 'sedentary',
      goal: 'deficit',
      tdee: 0,
      targetCalories: 0,
      targetProtein: 0,
      targetCarbs: 0,
      targetFat: 0,
      onboardingDone: false,

      setProfile: (data) => {
        set((state) => {
          const newState = { ...state, ...data };
          // Calculate targets when profile changes
          if (newState.weight && newState.height && newState.age) {
            const bmr = calcBMR({
              gender: newState.gender,
              weight: newState.weight,
              height: newState.height,
              age: newState.age
            });
            const tdee = calcTDEE(bmr, newState.activityLevel);
            const targets = calcTargets(tdee, newState.goal);
            
            return {
              ...newState,
              tdee: Math.round(tdee),
              targetCalories: targets.calories,
              targetProtein: targets.protein,
              targetCarbs: targets.carbs,
              targetFat: targets.fat
            };
          }
          return newState;
        });
      },

      recalculate: () => {
        const state = get();
        if (state.weight && state.height && state.age) {
          const bmr = calcBMR({
            gender: state.gender,
            weight: state.weight,
            height: state.height,
            age: state.age
          });
          const tdee = calcTDEE(bmr, state.activityLevel);
          const targets = calcTargets(tdee, state.goal);
          
          set({
            tdee: Math.round(tdee),
            targetCalories: targets.calories,
            targetProtein: targets.protein,
            targetCarbs: targets.carbs,
            targetFat: targets.fat
          });
        }
      },

      resetProfile: () => set({
        name: '',
        gender: 'male',
        age: 0,
        weight: 0,
        height: 0,
        activityLevel: 'sedentary',
        goal: 'deficit',
        tdee: 0,
        targetCalories: 0,
        targetProtein: 0,
        targetCarbs: 0,
        targetFat: 0,
        onboardingDone: false,
      })
    }),
    {
      name: 'dm_profile',
    }
  )
);

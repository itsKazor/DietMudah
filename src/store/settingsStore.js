import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveApiKey, getApiKey } from '../utils/storage';

export const useSettingsStore = create(
  persist(
    (set) => ({
      geminiApiKey: getApiKey() || '',
      preferredModel: 'gemini-1.5-flash',
      waterTarget: 8,

      setApiKey: (key) => {
        saveApiKey(key);
        set({ geminiApiKey: key });
      },
      setWaterTarget: (n) => set({ waterTarget: n }),
      setPreferredModel: (model) => set({ preferredModel: model }),
    }),
    {
      name: 'dm_settings',
      partialize: (state) => ({ 
        waterTarget: state.waterTarget, 
        preferredModel: state.preferredModel 
      }),
    }
  )
);

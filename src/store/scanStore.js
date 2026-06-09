import { create } from 'zustand';

export const useScanStore = create((set) => ({
  imageBase64: null,
  imagePreviewUrl: null,
  scanResult: null,
  isLoading: false,
  error: null,
  selectedMeal: 'sarapan',
  portionMultiplier: 1.0,

  setImage: (base64, previewUrl) => set({ 
    imageBase64: base64, 
    imagePreviewUrl: previewUrl,
    scanResult: null,
    error: null
  }),
  setScanResult: (result) => set({ scanResult: result, isLoading: false, error: null }),
  setLoading: (bool) => set({ isLoading: bool }),
  setError: (msg) => set({ error: msg, isLoading: false }),
  setSelectedMeal: (meal) => set({ selectedMeal: meal }),
  setPortionMultiplier: (val) => set({ portionMultiplier: val }),
  resetScan: () => set({
    imageBase64: null,
    imagePreviewUrl: null,
    scanResult: null,
    isLoading: false,
    error: null,
    portionMultiplier: 1.0
  })
}));

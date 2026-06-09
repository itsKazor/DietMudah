import React, { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, X, Upload } from 'lucide-react';
import { useScanStore } from '../store/scanStore';
import { useLogStore } from '../store/logStore';
import { useSettingsStore } from '../store/settingsStore';
import { scanFood } from '../services/geminiService';
import ScanResultCard from '../components/ScanResultCard';

export default function Scan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultMeal = searchParams.get('meal') || 'sarapan';
  
  const fileInputRef = useRef(null);
  const addEntry = useLogStore(state => state.addEntry);
  const geminiApiKey = useSettingsStore(state => state.geminiApiKey);
  
  const { 
    imageBase64, imagePreviewUrl, scanResult, isLoading, error, 
    selectedMeal, portionMultiplier,
    setImage, setScanResult, setLoading, setError, setSelectedMeal, setPortionMultiplier, resetScan 
  } = useScanStore();

  useEffect(() => {
    setSelectedMeal(defaultMeal);
    // Auto open camera on mount if no image
    if (!imageBase64 && fileInputRef.current) {
      fileInputRef.current.click();
    }
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

    const previewUrl = URL.createObjectURL(file);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      setImage(base64String, previewUrl);
      
      // Auto trigger scan
      setLoading(true);
      try {
        const result = await scanFood(base64String, geminiApiKey);
        setScanResult(result);
      } catch (err) {
        if (err.message === 'INVALID_API_KEY') {
          setError('API Key Gemini tidak valid atau belum diatur.');
        } else if (err.message === 'QUOTA_EXCEEDED') {
          setError('Kuota Gemini API habis.');
        } else {
          setError('Gagal menganalisis gambar. Pastikan makanan jelas dan koneksi stabil.');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!scanResult) return;
    
    const entry = {
      id: crypto.randomUUID(),
      meal: selectedMeal,
      name: scanResult.name,
      calories: Math.round(scanResult.calories * portionMultiplier),
      protein: Number((scanResult.protein * portionMultiplier).toFixed(1)),
      carbs: Number((scanResult.carbs * portionMultiplier).toFixed(1)),
      fat: Number((scanResult.fat * portionMultiplier).toFixed(1)),
      portion: `${portionMultiplier}x ${scanResult.portion}`,
      source: 'scan',
      confidence: scanResult.confidence,
      timestamp: Date.now()
    };
    
    addEntry(entry);
    resetScan();
    navigate('/');
  };

  const handleCancel = () => {
    if (isLoading) return;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    resetScan();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden">
      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={handleCancel} className="p-2 bg-black/40 rounded-full text-white backdrop-blur-sm active:scale-90 transition-transform">
          <X size={24} />
        </button>
      </div>

      {/* Camera View / Preview */}
      {!imagePreviewUrl ? (
        <div className="flex flex-col items-center justify-center text-white space-y-6">
          <Camera size={64} className="opacity-50" />
          <p>Membuka kamera...</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-white/20 rounded-full font-medium flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Upload size={20} />
            Pilih dari Galeri
          </button>
        </div>
      ) : (
        <div className="w-full h-full absolute inset-0">
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium text-lg">Menganalisis makanan...</p>
        </div>
      )}

      {/* Error Toast */}
      {error && !isLoading && (
        <div className="absolute bottom-20 left-4 right-4 bg-danger text-white p-4 rounded-xl shadow-lg z-20 animate-in slide-in-from-bottom-4 flex flex-col items-center text-center">
          <p className="font-medium mb-3">{error}</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-white text-danger font-bold rounded-lg active:scale-95 transition-transform"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Result Bottom Sheet */}
      {scanResult && !isLoading && !error && (
        <ScanResultCard 
          result={scanResult}
          portionMultiplier={portionMultiplier}
          selectedMeal={selectedMeal}
          onPortionChange={setPortionMultiplier}
          onMealChange={setSelectedMeal}
          onSave={handleSave}
          onEditManual={() => {
             alert('Fitur edit manual akan datang!');
          }}
        />
      )}
    </div>
  );
}

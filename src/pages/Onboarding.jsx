import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { validateApiKey } from '../services/geminiService';

export default function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useProfileStore(state => state.setProfile);
  const setApiKey = useSettingsStore(state => state.setApiKey);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    weight: '',
    height: '',
    age: '',
    activityLevel: 'sedentary',
    goal: 'deficit',
    apiKey: ''
  });
  
  const [isTesting, setIsTesting] = useState(false);
  const [apiError, setApiError] = useState('');

  const updateForm = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const nextStep = () => {
    if (step === 1 && !formData.name.trim()) return;
    if (step === 2 && (!formData.weight || !formData.height || !formData.age)) return;
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const finish = () => {
    setProfile({
      name: formData.name,
      gender: formData.gender,
      weight: Number(formData.weight),
      height: Number(formData.height),
      age: Number(formData.age),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      onboardingDone: true
    });
    if (formData.apiKey) {
      setApiKey(formData.apiKey);
    }
    navigate('/');
  };

  const testConnection = async () => {
    if (!formData.apiKey) {
      setApiError('API Key tidak boleh kosong');
      return;
    }
    setIsTesting(true);
    setApiError('');
    const isValid = await validateApiKey(formData.apiKey);
    setIsTesting(false);
    if (isValid) {
      finish();
    } else {
      setApiError('API Key tidak valid atau kuota habis');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8 mt-4">
        <div 
          className="h-full bg-primary-dark rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Selamat datang di DietMudah 👋</h1>
            <p className="text-text-secondary text-sm">Mari mulai dengan perkenalan singkat.</p>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Siapa nama Anda?</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="Misal: Budi"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Jenis Kelamin</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => updateForm('gender', 'male')}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-all ${formData.gender === 'male' ? 'bg-primary-light border-primary-light text-white shadow-md' : 'border-gray-200 text-text-secondary bg-white'}`}
                >Laki-laki</button>
                <button 
                  onClick={() => updateForm('gender', 'female')}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-all ${formData.gender === 'female' ? 'bg-primary-light border-primary-light text-white shadow-md' : 'border-gray-200 text-text-secondary bg-white'}`}
                >Perempuan</button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Profil Fisik Anda</h1>
            <p className="text-text-secondary text-sm">Data ini digunakan untuk menghitung kebutuhan kalori harian Anda.</p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Berat (kg)</label>
                  <input type="number" value={formData.weight} onChange={e => updateForm('weight', e.target.value)} placeholder="0" className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-dark outline-none tabular-nums" />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Tinggi (cm)</label>
                  <input type="number" value={formData.height} onChange={e => updateForm('height', e.target.value)} placeholder="0" className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-dark outline-none tabular-nums" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Usia</label>
                <input type="number" value={formData.age} onChange={e => updateForm('age', e.target.value)} placeholder="Misal: 25" className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-dark outline-none tabular-nums" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Target & Aktivitas</h1>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Level Aktivitas Fisik</label>
              <select 
                value={formData.activityLevel} 
                onChange={e => updateForm('activityLevel', e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-primary-dark outline-none appearance-none"
              >
                <option value="sedentary">Jarang olahraga / Pekerja kantoran</option>
                <option value="light">Ringan (Olahraga 1-3x/minggu)</option>
                <option value="moderate">Sedang (Olahraga 3-5x/minggu)</option>
                <option value="active">Berat (Olahraga 6-7x/minggu)</option>
                <option value="very_active">Sangat Berat / Atlet</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Tujuan Diet</label>
              <div className="flex flex-col gap-2">
                {['deficit', 'maintenance', 'surplus'].map(g => (
                  <button 
                    key={g}
                    onClick={() => updateForm('goal', g)}
                    className={`p-4 rounded-xl border text-left font-medium transition-all ${formData.goal === g ? 'bg-primary-tint border-primary-light text-primary-dark' : 'bg-white border-gray-200 text-text-primary'}`}
                  >
                    {g === 'deficit' && '📉 Turunkan Berat Badan'}
                    {g === 'maintenance' && '⚖️ Jaga Berat Badan'}
                    {g === 'surplus' && '📈 Naikkan Berat Badan'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Koneksi AI Vision</h1>
            <p className="text-text-secondary text-sm">DietMudah menggunakan Google Gemini untuk fitur scan makanan otomatis. Anda butuh API key sendiri (Gratis).</p>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Gemini API Key</label>
              <input 
                type="password" 
                value={formData.apiKey}
                onChange={e => updateForm('apiKey', e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-dark outline-none"
              />
              {apiError && <p className="text-xs text-danger mt-1">{apiError}</p>}
              <p className="text-xs text-text-muted mt-2">
                Dapatkan key di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary-dark underline">Google AI Studio</a>. Disimpan aman di browser Anda.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8 pb-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 py-4 rounded-xl bg-gray-200 text-text-primary font-bold active:scale-[0.98] transition-transform"
          >
            Kembali
          </button>
        )}
        
        {step < 4 ? (
          <button 
            onClick={nextStep}
            disabled={(step === 1 && !formData.name.trim()) || (step === 2 && (!formData.weight || !formData.height || !formData.age))}
            className="flex-1 py-4 rounded-xl bg-primary-dark text-white font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            Lanjut
          </button>
        ) : (
          <div className="flex-1 flex gap-3 flex-col">
            <button 
              onClick={testConnection}
              disabled={isTesting || !formData.apiKey}
              className="w-full py-4 rounded-xl bg-primary-dark text-white font-bold flex justify-center items-center active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {isTesting ? 'Menguji...' : 'Test & Simpan'}
            </button>
            <button 
              onClick={finish}
              className="w-full py-4 rounded-xl border border-gray-300 text-text-secondary font-bold active:scale-[0.98] transition-transform"
            >
              Nanti Saja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

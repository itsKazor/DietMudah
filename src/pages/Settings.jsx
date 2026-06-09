import React, { useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { User, Key, Trash2, Download, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Settings() {
  const profile = useProfileStore();
  const setProfile = useProfileStore(state => state.setProfile);
  const { geminiApiKey, setApiKey } = useSettingsStore();
  
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const handleUpdateApiKey = () => {
    setApiKey(tempApiKey);
    setShowApiKeyModal(false);
    alert('API Key berhasil disimpan!');
  };

  const handleReset = () => {
    if (window.confirm('PERINGATAN: Semua data makanan, riwayat, dan profil Anda akan dihapus permanen. Lanjutkan?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dietmudah-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface pb-36">
      <div className="bg-primary-dark pt-8 pb-8 px-6 rounded-b-[40px] shadow-[0_10px_20px_rgba(27,67,50,0.1)] text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-primary-tint font-medium opacity-90 mt-1">{profile.goal === 'deficit' ? 'Turunkan BB' : profile.goal === 'maintenance' ? 'Jaga BB' : 'Naikkan BB'}</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        <h3 className="font-bold text-text-secondary px-2 text-sm uppercase tracking-wider mb-2">Pengaturan</h3>
        
        {/* Profile Stats */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex p-4 border-b border-gray-50">
            <div className="flex-1 text-center border-r border-gray-100">
              <p className="text-sm text-text-secondary font-medium">Berat</p>
              <p className="font-bold text-lg text-text-primary mt-1">{profile.weight} <span className="text-sm font-normal">kg</span></p>
            </div>
            <div className="flex-1 text-center border-r border-gray-100">
              <p className="text-sm text-text-secondary font-medium">Tinggi</p>
              <p className="font-bold text-lg text-text-primary mt-1">{profile.height} <span className="text-sm font-normal">cm</span></p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm text-text-secondary font-medium">Target</p>
              <p className="font-bold text-lg text-calorie mt-1 tabular-nums">{profile.targetCalories}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const w = prompt('Update Berat Badan (kg):', profile.weight);
              if (w && !isNaN(Number(w))) setProfile({ weight: Number(w) });
            }}
            className="w-full py-4 text-primary-dark font-bold text-sm flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          >
            Update Berat Badan
          </button>
        </div>

        {/* Action List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => {
              setTempApiKey(geminiApiKey || '');
              setShowApiKeyModal(true);
            }}
            className="w-full p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Key size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary">Gemini API Key</p>
                <p className="text-xs font-medium mt-0.5 text-text-secondary">
                  {geminiApiKey ? 'Terhubung (Klik untuk ubah)' : 'Belum diatur'}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          <button 
            onClick={handleExport}
            className="w-full p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                <Download size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary">Backup Data</p>
                <p className="text-xs font-medium mt-0.5 text-text-secondary">Simpan file riwayat ke perangkat</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          <button 
            onClick={handleReset}
            className="w-full p-4 flex items-center justify-between active:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                <Trash2 size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-danger">Reset Aplikasi</p>
                <p className="text-xs font-medium mt-0.5 text-red-400">Hapus riwayat dan profil permanen</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm font-bold text-text-muted">DietMudah v1.0.0</p>
          <p className="text-xs font-medium text-text-muted/60 mt-1">Progressive Web App</p>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-text-primary">Update API Key</h3>
            <p className="text-sm text-text-secondary mb-6 font-medium">Masukkan Google Gemini API Key Anda. Disimpan 100% aman di browser.</p>
            
            <input 
              type="password"
              value={tempApiKey}
              onChange={e => setTempApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-dark focus:ring-2 focus:ring-primary-light outline-none mb-6 font-mono text-sm transition-all"
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-text-primary font-bold active:scale-95 transition-transform"
              >
                Batal
              </button>
              <button 
                onClick={handleUpdateApiKey}
                className="flex-1 py-4 rounded-2xl bg-primary-dark text-white font-bold active:scale-95 transition-transform shadow-lg shadow-primary-dark/30"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

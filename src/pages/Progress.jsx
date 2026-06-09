import React, { useMemo } from 'react';
import { useLogStore } from '../store/logStore';
import { useProfileStore } from '../store/profileStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell } from 'recharts';
import BottomNav from '../components/BottomNav';

export default function Progress() {
  const allLogs = useLogStore(state => state.logs);
  const targetCalories = useProfileStore(state => state.targetCalories);

  const { chartData, avgCalories, macroData } = useMemo(() => {
    // Generate last 7 days including today
    const data = [];
    let totalCals = 0;
    let daysWithData = 0;
    
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Use local timezone string to match our logic
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      
      const dayLog = allLogs[dateStr];
      let calories = 0;
      
      if (dayLog && dayLog.entries) {
        dayLog.entries.forEach(e => {
          calories += e.calories;
          totalP += e.protein;
          totalC += e.carbs;
          totalF += e.fat;
        });
        if (calories > 0) {
          totalCals += calories;
          daysWithData++;
        }
      }
      
      data.push({
        name: dayName,
        calories: Math.round(calories)
      });
    }

    const avg = daysWithData > 0 ? Math.round(totalCals / daysWithData) : 0;

    const macroData = [
      { name: 'Protein', value: totalP, color: '#4EA8DE' },
      { name: 'Karbo', value: totalC, color: '#F4A261' },
      { name: 'Lemak', value: totalF, color: '#E76F51' }
    ].filter(m => m.value > 0);

    return { chartData: data, avgCalories: avg, macroData };
  }, [allLogs]);

  return (
    <div className="min-h-screen bg-surface pb-36">
      <div className="bg-primary-dark pt-8 pb-8 px-6 rounded-b-[40px] shadow-[0_10px_20px_rgba(27,67,50,0.1)] text-white mb-6">
        <h1 className="text-2xl font-bold">Progress Mingguan</h1>
        <p className="text-primary-tint opacity-90 mt-1 font-medium">Pantau asupan kalori & nutrisi Anda</p>
      </div>

      <div className="px-5 space-y-6">
        {/* Rata-rata kalori */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary font-medium">Rata-rata 7 Hari</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{avgCalories} <span className="text-sm font-normal text-text-muted">kcal/hari</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary font-medium">Target</p>
            <p className="text-xl font-bold text-calorie mt-1 tabular-nums">{targetCalories}</p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-text-primary mb-6">Kalori Harian</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine y={targetCalories} stroke="#EF476F" strokeDasharray="3 3" />
                <Bar dataKey="calories" fill="#52B788" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-text-primary mb-2">Distribusi Makro (7 Hari)</h3>
          
          {macroData.length > 0 ? (
            <div className="flex items-center mt-2">
              <div className="w-1/2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 pl-4 space-y-4">
                {macroData.map(macro => (
                  <div key={macro.name} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: macro.color }}></div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{macro.name}</p>
                      <p className="text-sm font-medium text-text-secondary">{Math.round(macro.value)}g</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-text-muted text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-4">
              Belum ada data makro minggu ini.<br/>Mulai log makanan Anda!
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

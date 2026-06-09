import React, { useEffect, useState } from 'react';

export default function MacroBar({ label, current = 0, target = 0, color, unit = 'g' }) {
  const [progress, setProgress] = useState(0);
  
  // Prevent division by zero
  const safeTarget = target > 0 ? target : 1;
  const percentage = Math.min(Math.max((current / safeTarget) * 100, 0), 100);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-end text-sm">
        <span className="font-semibold text-text-primary">{label}</span>
        <span className="text-text-secondary tabular-nums">
          <span className="text-text-primary font-medium">{current.toFixed(1)}</span> / {target.toFixed(1)}{unit}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: color 
          }}
        />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

export default function CalorieRing({ consumed = 0, target = 2000, size = 200 }) {
  const [progress, setProgress] = useState(0);
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const safeTarget = target > 0 ? target : 1;
  const percentage = Math.min(Math.max((consumed / safeTarget) * 100, 0), 100);
  
  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const remaining = target - consumed;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // tailwind gray-200
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FF6B35" // calorie color
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 1s ease-in-out'
          }}
        />
      </svg>
      
      {/* Inner Content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-text-primary tabular-nums">
          {Math.round(consumed)}
        </span>
        <span className="text-xs text-text-secondary mt-1">dikonsumsi</span>
        
        {remaining > 0 ? (
          <span className="text-sm font-semibold text-primary-dark mt-2 tabular-nums">
            {Math.round(remaining)} kcal lagi
          </span>
        ) : (
          <span className="text-sm font-semibold text-success mt-2">
            Tercapai! 🎉
          </span>
        )}
      </div>
    </div>
  );
}

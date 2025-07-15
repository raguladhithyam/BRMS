import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-xs text-gray-600">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}; 
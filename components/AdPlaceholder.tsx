import React from 'react';

interface Props {
  format?: 'banner' | 'rectangle' | 'vertical';
  className?: string;
}

const AdPlaceholder: React.FC<Props> = ({ format = 'banner', className = '' }) => {
  let heightClass = 'h-32'; // banner default
  let label = 'Advertisement';

  if (format === 'vertical') {
    heightClass = 'h-auto min-h-[400px]';
  } else if (format === 'rectangle') {
    heightClass = 'h-full min-h-[300px]';
  }

  return (
    <div className={`w-full ${heightClass} bg-stone-50 border border-stone-200 border-dashed rounded-xl flex flex-col items-center justify-center text-stone-400 p-4 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest font-semibold mb-2">{label}</span>
      <div className="text-center">
        <span className="text-sm font-medium text-stone-500 block">Google AdSense / Sponsor</span>
        <span className="text-xs opacity-60">{format} unit</span>
      </div>
    </div>
  );
};

export default AdPlaceholder;

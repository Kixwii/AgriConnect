import React from 'react';

interface TrustScoreGaugeProps {
  score: number;
  showLabels?: boolean;
}

const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({ score, showLabels = true }) => {
  const scoreColorBg = score > 85 ? 'bg-brand-green-600' : score > 70 ? 'bg-yellow-500' : 'bg-red-500';
  const scoreColorText = score > 85 ? 'text-brand-green-700' : score > 70 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Trust Score</span>
          <span className={`text-sm font-bold ${scoreColorText}`}>{score}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`${scoreColorBg} h-1.5 rounded-full transition-all duration-1000 ease-in-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TrustScoreGauge;

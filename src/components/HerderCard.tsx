import React from 'react';
import { Herder } from '../types';
import TrustScoreGauge from './TrustScoreGauge';
import { LocationIcon, LivestockIcon, CalendarIcon } from './icons';

interface HerderCardProps {
  herder: Herder;
  onSelect: (herder: Herder) => void;
}

const HerderCard: React.FC<HerderCardProps> = ({ herder, onSelect }) => {
  const getTopLivestock = () => {
    return herder.livestock
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)
      .map(l => `${l.count} ${l.type}`)
      .join(', ');
  };

  return (
    <div 
      onClick={() => onSelect(herder)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-200 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start space-x-5">
          <img src={herder.avatarUrl} alt={herder.name} className="w-20 h-20 rounded-full border-4 border-white shadow-md flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-brand-green-900 truncate">{herder.name}</h3>
            <div className="flex items-center text-gray-500 mt-1">
              <LocationIcon className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{herder.location}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                herder.isNomadic 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {herder.isNomadic ? 'Nomadic' : 'Settled'}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 ml-2">
                {herder.communityRole}
              </span>
            </div>
            <div className="mt-4">
              <TrustScoreGauge score={herder.trustScore} />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <LivestockIcon className="w-5 h-5 mr-3 text-brand-green-600" />
            <div>
              <p className="font-semibold">Top Livestock</p>
              <p className="text-gray-500">{getTopLivestock()}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-5 h-5 mr-3 text-brand-green-600" />
            <div>
              <p className="font-semibold">Herd Size</p>
              <p className="text-gray-500">{herder.herdSize} animals</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Avg. Income/Season:</span>
            <span className="font-semibold text-brand-green-600">KSh {herder.avgIncomePerSeason.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="bg-brand-green-50 text-center py-3 px-6">
        <span className="text-brand-green-800 font-semibold text-sm">View Profile & Connect</span>
      </div>
    </div>
  );
};

export default HerderCard;

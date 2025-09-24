import React from 'react';
import { Farmer } from '../types';
import TrustScoreGauge from './TrustScoreGauge';
import { LocationIcon, CropIcon, CalendarIcon } from './icons';

interface FarmerCardProps {
  farmer: Farmer;
  onSelect: (farmer: Farmer) => void;
}

const FarmerCard: React.FC<FarmerCardProps> = ({ farmer, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(farmer)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-200 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start space-x-5">
          <img src={farmer.avatarUrl} alt={farmer.name} className="w-20 h-20 rounded-full border-4 border-white shadow-md flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-brand-green-900 truncate">{farmer.name}</h3>
            <div className="flex items-center text-gray-500 mt-1">
              <LocationIcon className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{farmer.location}</span>
            </div>
            <div className="mt-4">
              <TrustScoreGauge score={farmer.trustScore} />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <CropIcon className="w-5 h-5 mr-3 text-brand-green-600" />
            <div>
              <p className="font-semibold">Top Crops</p>
              <p className="text-gray-500">{farmer.crops.slice(0, 2).join(', ')}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-5 h-5 mr-3 text-brand-green-600" />
            <div>
              <p className="font-semibold">Seasons Farmed</p>
              <p className="text-gray-500">{farmer.seasonsFarmed}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-brand-green-50 text-center py-3 px-6">
        <span className="text-brand-green-800 font-semibold text-sm">View Profile & Connect</span>
      </div>
    </div>
  );
};

export default FarmerCard;

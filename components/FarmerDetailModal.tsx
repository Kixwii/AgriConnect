import React, { Fragment, useMemo } from 'react';
import { Farmer } from '../types';
import { LocationIcon, CropIcon, CalendarIcon, ChartIcon, ShieldCheckIcon, SparklesIcon } from './icons';
import TrustScoreGauge from './TrustScoreGauge';
import { CURRENT_USER_ID } from '../constants';

interface FarmerDetailModalProps {
  farmer: Farmer | null;
  onClose: () => void;
  onRequestConnection: (farmer: Farmer) => void;
  onGeneratePlan: (farmer: Farmer) => void;
  currentUser: Farmer | undefined;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-8 h-8 bg-brand-green-100 rounded-lg flex items-center justify-center text-brand-green-700">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-brand-brown-900">{value}</p>
    </div>
  </div>
);

const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({ farmer, onClose, onRequestConnection, onGeneratePlan, currentUser }) => {
  if (!farmer) return null;
  
  const doesCurrentUserOweFarmer = useMemo(() => {
    if (!currentUser?.connections || !farmer) {
      return false;
    }
    return currentUser.connections.some(loan => 
      loan.type === 'borrowed' && 
      loan.farmerId === farmer.id &&
      loan.status === 'Active'
    );
  }, [currentUser, farmer]);

  const repaymentRate = farmer.repaymentHistory.totalLoans > 0 
    ? ((farmer.repaymentHistory.repaidOnTime / farmer.repaymentHistory.totalLoans) * 100).toFixed(0) 
    : 100;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-brand-brown-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left sm:space-x-6 space-y-4 sm:space-y-0">
            <img src={farmer.avatarUrl} alt={farmer.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 border-white shadow-lg -mt-12 sm:-mt-16" />
            <div className="sm:pt-2 flex-grow">
              <h2 className="text-3xl font-bold text-brand-green-900">{farmer.name}</h2>
              <div className="flex items-center justify-center sm:justify-start text-gray-500 mt-2">
                <LocationIcon className="w-5 h-5 mr-2" />
                <span>{farmer.location}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Member since {farmer.memberSince}</p>
            </div>
            <div className="w-full sm:w-40 sm:ml-auto flex-shrink-0">
                <div className="text-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500">Trust Score</p>
                    <p className={`text-5xl font-bold ${farmer.trustScore > 85 ? 'text-brand-green-600' : farmer.trustScore > 70 ? 'text-yellow-500' : 'text-red-500'}`}>{farmer.trustScore}</p>
                    <div className="mt-2">
                      <TrustScoreGauge score={farmer.trustScore} showLabels={false} />
                    </div>
                </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-brand-brown-800 border-b pb-2 mb-4">Farmer Bio</h3>
            <p className="text-gray-600 leading-relaxed">{farmer.bio}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-brand-brown-800 border-b pb-2 mb-4">Track Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              <DetailItem icon={<CropIcon className="w-5 h-5"/>} label="Main Crops" value={farmer.crops.join(', ')} />
              <DetailItem icon={<CalendarIcon className="w-5 h-5"/>} label="Seasons Farmed" value={farmer.seasonsFarmed} />
              <DetailItem icon={<ChartIcon className="w-5 h-5"/>} label="Avg. Yield" value={`${farmer.avgYieldKgPerHectare} kg/ha`} />
              <DetailItem icon={<ShieldCheckIcon className="w-5 h-5"/>} label="Repaid On-Time" value={`${farmer.repaymentHistory.repaidOnTime} / ${farmer.repaymentHistory.totalLoans}`} />
              <DetailItem icon={<ShieldCheckIcon className="w-5 h-5"/>} label="Repayment Rate" value={`${repaymentRate}%`} />
              <DetailItem icon={<ShieldCheckIcon className="w-5 h-5"/>} label="Defaults" value={farmer.repaymentHistory.defaulted} />
            </div>
          </div>
          
          <div className="mt-8 sm:mt-10 flex flex-col-reverse sm:flex-row justify-end items-center space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
            {doesCurrentUserOweFarmer && (
               <button 
                onClick={() => onGeneratePlan(farmer)}
                className="w-full sm:w-auto px-6 py-3 bg-brand-brown-200 text-brand-brown-900 rounded-full font-semibold hover:bg-brand-brown-300 transition-colors flex items-center justify-center space-x-2">
                <SparklesIcon className="w-5 h-5" />
                <span>Generate AI Repayment Plan</span>
              </button>
            )}
            {farmer.id !== CURRENT_USER_ID && (
              <button 
                onClick={() => onRequestConnection(farmer)}
                className="w-full sm:w-auto px-8 py-3 bg-brand-green-600 text-white rounded-full font-semibold hover:bg-brand-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Request Loan Connection
              </button>
            )}
             <button onClick={onClose} className="w-full sm:w-auto px-6 py-3 text-brand-brown-800 bg-white border border-gray-300 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(0, 20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FarmerDetailModal;
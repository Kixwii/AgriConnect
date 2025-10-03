
import React from 'react';
import { Farmer, RepaymentPlan } from '../types';
import { SparklesIcon, SpinnerIcon, CalendarIcon } from './icons';

interface AiRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: Farmer | null;
  plan: RepaymentPlan | null;
  isLoading: boolean;
  error: string | null;
}

const AiRepaymentModal: React.FC<AiRepaymentModalProps> = ({ isOpen, onClose, farmer, plan, isLoading, error }) => {
  if (!isOpen || !farmer) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-transform duration-300 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start space-x-4">
             <div className="flex-shrink-0 w-12 h-12 bg-brand-green-100 rounded-full flex items-center justify-center text-brand-green-600">
                <SparklesIcon className="w-7 h-7" />
            </div>
            <div>
                 <h2 className="text-2xl font-bold text-brand-green-900">AI-Powered Repayment Plan</h2>
                 <p className="text-gray-500 mt-1">Suggested schedule for <span className="font-semibold">{farmer.name}</span> based on their crops and location.</p>
            </div>
          </div>

          <div className="mt-6 min-h-[250px] flex flex-col justify-center">
            {isLoading && (
              <div className="text-center">
                <SpinnerIcon className="w-12 h-12 text-brand-green-500 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-gray-700">Generating Plan...</h3>
                <p className="mt-1 text-gray-500">Analyzing crop cycles, weather patterns, and market data.</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                <h3 className="font-bold">An Error Occurred</h3>
                <p>{error}</p>
              </div>
            )}
            {plan && !isLoading && (
              <div className="space-y-4">
                <div className="flow-root">
                    <ul className="-mb-8">
                        {plan.map((item, itemIdx) => (
                        <li key={item.installment}>
                            <div className="relative pb-8">
                            {itemIdx !== plan.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3 items-start">
                                <div>
                                <span className="h-8 w-8 rounded-full bg-brand-green-500 flex items-center justify-center ring-8 ring-white text-white font-bold">
                                    {item.installment}
                                </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <CalendarIcon className="w-4 h-4 mr-1.5" />
                                            {item.suggestedDate}
                                        </p>
                                        <p className="font-bold text-lg text-brand-green-800">${item.amount}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{item.reasoning}</p>
                                </div>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-8 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
          >
            Close
          </button>
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

export default AiRepaymentModal;
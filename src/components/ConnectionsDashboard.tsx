
import React, { useMemo } from 'react';
import { Farmer, Loan, LoanRequest } from '../types';
import { LocationIcon, CurrencyDollarIcon, CalendarIcon, PaperAirplaneIcon } from './icons';

interface ConnectionsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: Farmer | undefined;
  allFarmers: Farmer[];
  requests: LoanRequest[];
}

const LoanCard: React.FC<{ loan: Loan; connectedFarmer: Farmer | undefined }> = ({ loan, connectedFarmer }) => {
  if (!connectedFarmer) return null;

  const isLent = loan.type === 'lent';
  const amountColor = isLent ? 'text-brand-green-600' : 'text-red-600';
  const statusColor = loan.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-brand-green-100 text-brand-green-800';

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-start space-x-3">
      <img src={connectedFarmer.avatarUrl} alt={connectedFarmer.name} className="w-16 h-16 rounded-full border-4 border-white shadow-sm flex-shrink-0" />
      <div className="flex-grow min-w-0">
        <h4 className="font-bold text-brand-green-900 truncate">{connectedFarmer.name}</h4>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <LocationIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{connectedFarmer.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">Due: {loan.dueDate}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-2xl font-bold ${amountColor}`}>${loan.amount.toLocaleString()}</p>
        <span className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColor}`}>{loan.status}</span>
      </div>
    </div>
  );
};

const RequestCard: React.FC<{ request: LoanRequest; connectedFarmer: Farmer | undefined; type: 'incoming' | 'outgoing' }> = ({ request, connectedFarmer, type }) => {
    if (!connectedFarmer) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-start space-x-3">
                <img src={connectedFarmer.avatarUrl} alt={connectedFarmer.name} className="w-16 h-16 rounded-full border-4 border-white shadow-sm flex-shrink-0" />
                <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-brand-green-900 truncate">{connectedFarmer.name}</h4>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                        <LocationIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{connectedFarmer.location}</span>
                    </div>
                     <p className="text-gray-600 text-sm mt-2 line-clamp-2 italic">"{request.message || 'No message provided.'}"</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className={`text-2xl font-bold text-brand-brown-800`}>${request.amount.toLocaleString()}</p>
                    <span className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 capitalize`}>{request.status}</span>
                </div>
            </div>
            {type === 'incoming' && (
                <div className="mt-4 pt-3 border-t flex justify-end space-x-2">
                    <button className="px-4 py-1.5 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition-colors">Decline</button>
                    <button className="px-4 py-1.5 text-sm font-semibold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-full transition-colors">Accept</button>
                </div>
            )}
        </div>
    );
};


const ConnectionsDashboard: React.FC<ConnectionsDashboardProps> = ({ isOpen, onClose, user, allFarmers, requests }) => {
  const { lentLoans, borrowedLoans, incomingRequests, outgoingRequests } = useMemo(() => {
    if (!user) return { lentLoans: [], borrowedLoans: [], incomingRequests: [], outgoingRequests: [] };
    
    const lent = user.connections?.filter(c => c.type === 'lent') ?? [];
    const borrowed = user.connections?.filter(c => c.type === 'borrowed') ?? [];
    const incoming = requests.filter(r => r.toId === user.id && r.status === 'pending');
    const outgoing = requests.filter(r => r.fromId === user.id && r.status === 'pending');

    return { lentLoans: lent, borrowedLoans: borrowed, incomingRequests: incoming, outgoingRequests: outgoing };
  }, [user, requests]);

  if (!isOpen) return null;

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
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-brand-green-900">My Connections</h2>
                    <p className="text-gray-500 mt-1">A summary of your lending, borrowing, and pending requests.</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="mt-8 space-y-10">
                <section>
                    <h3 className="text-xl font-semibold text-brand-brown-800 border-b pb-2 mb-4 flex items-center">
                        <PaperAirplaneIcon className="w-6 h-6 mr-3 text-yellow-600 transform -rotate-45" />
                        Outgoing Requests ({outgoingRequests.length})
                    </h3>
                    <div className="space-y-4">
                        {outgoingRequests.length > 0 ? (
                           outgoingRequests.map(req => (
                               <RequestCard 
                                   key={req.id}
                                   request={req}
                                   connectedFarmer={allFarmers.find(f => f.id === req.toId)}
                                   type="outgoing"
                               />
                           ))
                        ) : (
                            <p className="text-gray-500 italic">You have no pending outgoing requests.</p>
                        )}
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-semibold text-brand-brown-800 border-b pb-2 mb-4 flex items-center">
                        <PaperAirplaneIcon className="w-6 h-6 mr-3 text-blue-600 transform rotate-135" />
                        Incoming Requests ({incomingRequests.length})
                    </h3>
                    <div className="space-y-4">
                        {incomingRequests.length > 0 ? (
                           incomingRequests.map(req => (
                               <RequestCard 
                                   key={req.id}
                                   request={req}
                                   connectedFarmer={allFarmers.find(f => f.id === req.fromId)}
                                   type="incoming"
                               />
                           ))
                        ) : (
                            <p className="text-gray-500 italic">You have no pending incoming requests.</p>
                        )}
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-semibold text-brand-brown-800 border-b pb-2 mb-4 flex items-center">
                        <CurrencyDollarIcon className="w-6 h-6 mr-3 text-brand-green-600" />
                        Loans to Others ({lentLoans.length})
                    </h3>
                    <div className="space-y-4">
                        {lentLoans.length > 0 ? (
                            lentLoans.map(loan => (
                                <LoanCard 
                                    key={`${loan.farmerId}-lent`}
                                    loan={loan} 
                                    connectedFarmer={allFarmers.find(f => f.id === loan.farmerId)} 
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 italic">You have not lent money to any farmers yet.</p>
                        )}
                    </div>
                </section>
                 <section>
                    <h3 className="text-xl font-semibold text-brand-brown-800 border-b pb-2 mb-4 flex items-center">
                         <CurrencyDollarIcon className="w-6 h-6 mr-3 text-red-500" />
                        My Loans ({borrowedLoans.length})
                    </h3>
                    <div className="space-y-4">
                         {borrowedLoans.length > 0 ? (
                            borrowedLoans.map(loan => (
                                <LoanCard 
                                    key={`${loan.farmerId}-borrowed`}
                                    loan={loan} 
                                    connectedFarmer={allFarmers.find(f => f.id === loan.farmerId)} 
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 italic">You do not have any active loans.</p>
                        )}
                    </div>
                </section>
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
  )
};

export default ConnectionsDashboard;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Farmer, LoanRequest, RepaymentPlan } from './types';
import { MOCK_FARMERS, CURRENT_USER_ID } from './constants';
import FarmerCard from './components/FarmerCard';
import FarmerDetailModal from './components/FarmerDetailModal';
import ConnectionsDashboard from './components/ConnectionsDashboard';
import LoanRequestModal from './components/LoanRequestModal';
import AiRepaymentModal from './components/AiRepaymentModal';
import { UsersIcon } from './components/icons';
import { GoogleGenAI, Type } from '@google/genai';
require('dotenv').config();


const App: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [sortKey, setSortKey] = useState<'trustScore' | 'name'>('trustScore');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTargetFarmer, setRequestTargetFarmer] = useState<Farmer | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);

  // AI Repayment Plan State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalFarmer, setAiModalFarmer] = useState<Farmer | null>(null);
  const [repaymentPlan, setRepaymentPlan] = useState<RepaymentPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setFarmers(MOCK_FARMERS);
    console.log("loading page");
  }, []);

  useEffect(() => {
    const isModalOpen = selectedFarmer !== null || isConnectionsOpen || isRequestModalOpen || isAiModalOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [selectedFarmer, isConnectionsOpen, isRequestModalOpen, isAiModalOpen]);

  const currentUser = useMemo(() => farmers.find(f => f.id === CURRENT_USER_ID), [farmers]);
  
  const handleSelectFarmer = useCallback((farmer: Farmer) => {
    setSelectedFarmer(farmer);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedFarmer(null);
  }, []);

  const handleRequestConnection = useCallback((farmer: Farmer) => {
    setRequestTargetFarmer(farmer);
    setIsRequestModalOpen(true);
    setSelectedFarmer(null); // Close detail modal when opening request modal
  }, []);

  const handleCloseRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
    setRequestTargetFarmer(null);
  }, []);

  const handleSubmitLoanRequest = useCallback((amount: number, message: string) => {
    if (requestTargetFarmer && currentUser) {
      const newRequest: LoanRequest = {
        id: Date.now().toString(),
        fromId: currentUser.id,
        toId: requestTargetFarmer.id,
        amount,
        message,
        status: 'pending',
      };
      setLoanRequests(prev => [...prev, newRequest]);
    }
  }, [requestTargetFarmer, currentUser]);

  const fetchAiRepaymentPlan = useCallback(async (farmer: Farmer) => {
    if (!process.env.GEMINI_API_KEY) {
      setAiError("API key is not configured.");
      setIsGeneratingPlan(false);
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are a financial advisor for small-scale farmers in Africa.
      Given the following farmer profile:
      - Location: ${farmer.location}
      - Main Crops: ${farmer.crops.join(', ')}

      Generate a customized, hypothetical 4-installment loan repayment schedule for a $1000 loan.
      Base the schedule on typical crop cycles, potential harvest times, and market price fluctuations for their specific crops and region.
      For each installment, provide a suggested date (month and year) and a brief reasoning for that timing.
      The current date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}.
      Provide the output in JSON format.`;
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            installment: { type: Type.NUMBER },
            amount: { type: Type.NUMBER },
            suggestedDate: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ['installment', 'amount', 'suggestedDate', 'reasoning'],
        },
      };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        }
      });
      const plan = JSON.parse(response.text);
      setRepaymentPlan(plan);
    } catch (error) {
      console.error("AI plan generation failed:", error);
      setAiError("Failed to generate a repayment plan. The AI may be unavailable right now.");
    } finally {
      setIsGeneratingPlan(false);
    }
  }, []);

  const handleGeneratePlan = useCallback((farmer: Farmer) => {
    setSelectedFarmer(null); // Close detail modal
    setAiModalFarmer(farmer);
    setIsAiModalOpen(true);
    setIsGeneratingPlan(true);
    setRepaymentPlan(null);
    setAiError(null);
    fetchAiRepaymentPlan(farmer);
  }, [fetchAiRepaymentPlan]);

  const handleCloseAiModal = useCallback(() => {
    setIsAiModalOpen(false);
    setAiModalFarmer(null);
    setRepaymentPlan(null);
    setAiError(null);
  }, []);
  
  const filteredAndSortedFarmers = useMemo(() => {
    return farmers
      .filter(farmer => 
        farmer.id !== CURRENT_USER_ID && (
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farmer.crops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      )
      .sort((a, b) => {
        if (sortKey === 'trustScore') {
          return b.trustScore - a.trustScore;
        }
        return a.name.localeCompare(b.name);
      });
  }, [farmers, sortKey, searchTerm]);

  return (
    <div className="min-h-screen bg-brand-brown-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-brand-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <h1 className="text-2xl font-bold text-brand-green-800">AgriConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsConnectionsOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-green-50 text-brand-green-800 rounded-full hover:bg-brand-green-100 transition-colors border border-brand-green-200"
            >
              <UsersIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">My Connections</span>
            </button>
            {currentUser && (
                <>
                  <div className="h-8 border-l border-gray-200 hidden sm:block"></div>
                  <button
                    onClick={() => handleSelectFarmer(currentUser)}
                    className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={`View your profile, ${currentUser.name}`}
                  >
                    <img src={currentUser.avatarUrl} alt="My Profile" className="w-10 h-10 rounded-full border-2 border-brand-green-200" />
                    <div className="hidden lg:block text-left">
                      <p className="font-semibold text-sm text-brand-brown-900 leading-tight">{currentUser.name}</p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">Trust Score: </span>
                        <span className={`text-xs font-bold ml-1 ${currentUser.trustScore > 85 ? 'text-brand-green-600' : currentUser.trustScore > 70 ? 'text-yellow-600' : 'text-red-600'}`}>{currentUser.trustScore}</span>
                      </div>
                    </div>
                  </button>
                </>
              )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
               <input 
                type="text"
                placeholder="Search by name, location, or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500 transition-colors bg-brand-brown-50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm font-medium text-gray-600">Sort by:</span>
              <select 
                value={sortKey} 
                onChange={(e) => setSortKey(e.target.value as 'trustScore' | 'name')}
                className="border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500 transition-colors bg-brand-brown-50"
              >
                <option value="trustScore">Trust Score</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredAndSortedFarmers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
            {filteredAndSortedFarmers.map(farmer => (
              <FarmerCard key={farmer.id} farmer={farmer} onSelect={handleSelectFarmer} />
            ))}
          </div>
        ) : (
           <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">No Farmers Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>
      
      <FarmerDetailModal 
        farmer={selectedFarmer} 
        onClose={handleCloseModal} 
        onRequestConnection={handleRequestConnection}
        onGeneratePlan={handleGeneratePlan}
        currentUser={currentUser}
      />
      <ConnectionsDashboard 
        isOpen={isConnectionsOpen} 
        onClose={() => setIsConnectionsOpen(false)} 
        user={currentUser}
        allFarmers={farmers}
        requests={loanRequests}
      />
      <LoanRequestModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        farmer={requestTargetFarmer}
        onSubmit={handleSubmitLoanRequest}
      />
      <AiRepaymentModal
        isOpen={isAiModalOpen}
        onClose={handleCloseAiModal}
        farmer={aiModalFarmer}
        plan={repaymentPlan}
        isLoading={isGeneratingPlan}
        error={aiError}
      />
    </div>
  );
};

export default App;
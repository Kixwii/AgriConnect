import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Herder, LoanRequest, RepaymentPlan, MarketPrice, WeatherAlert } from './types';
import { MOCK_HERDERS, MOCK_MARKET_PRICES, MOCK_WEATHER_ALERTS, CURRENT_USER_ID } from './constants';
import HerderCard from './components/HerderCard';
import HerderDetailModal from './components/HerderDetailModal';
import ConnectionsDashboard from './components/ConnectionsDashboard';
import LoanRequestModal from './components/LoanRequestModal';
import AiRepaymentModal from './components/AiRepaymentModal';
import MarketIntelligencePanel from './components/MarketIntelligencePanel';
import WeatherAlertsPanel from './components/WeatherAlertsPanel';
import { UsersIcon, MarketIcon, AlertIcon } from './components/icons';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [herders, setHerders] = useState<Herder[]>([]);
  const [selectedHerder, setSelectedHerder] = useState<Herder | null>(null);
  const [sortKey, setSortKey] = useState<'trustScore' | 'name' | 'herdSize'>('trustScore');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTargetHerder, setRequestTargetHerder] = useState<Herder | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'herders' | 'market' | 'alerts'>('herders');

  // AI Repayment Plan State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalHerder, setAiModalHerder] = useState<Herder | null>(null);
  const [repaymentPlan, setRepaymentPlan] = useState<RepaymentPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setHerders(MOCK_HERDERS);
  }, []);

  useEffect(() => {
    const isModalOpen = selectedHerder !== null || isConnectionsOpen || isRequestModalOpen || isAiModalOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [selectedHerder, isConnectionsOpen, isRequestModalOpen, isAiModalOpen]);

  const currentUser = useMemo(() => herders.find(h => h.id === CURRENT_USER_ID), [herders]);
  
  const handleSelectHerder = useCallback((herder: Herder) => {
    setSelectedHerder(herder);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedHerder(null);
  }, []);

  const handleRequestConnection = useCallback((herder: Herder) => {
    setRequestTargetHerder(herder);
    setIsRequestModalOpen(true);
    setSelectedHerder(null); // Close detail modal when opening request modal
  }, []);

  const handleCloseRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
    setRequestTargetHerder(null);
  }, []);

  const handleSubmitLoanRequest = useCallback((amount: number, message: string, purpose: string) => {
    if (requestTargetHerder && currentUser) {
      const newRequest: LoanRequest = {
        id: Date.now().toString(),
        fromId: currentUser.id,
        toId: requestTargetHerder.id,
        amount,
        message,
        status: 'pending',
        purpose: purpose as any
      };
      setLoanRequests(prev => [...prev, newRequest]);
    }
  }, [requestTargetHerder, currentUser]);

  const fetchAiRepaymentPlan = useCallback(async (herder: Herder) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      setAiError("API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.");
      setIsGeneratingPlan(false);
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a financial advisor for pastoralist herders in Kenya.
      Given the following herder profile:
      - Location: ${herder.location}
      - Livestock: ${herder.livestock.map(l => `${l.count} ${l.type}`).join(', ')}
      - Is Nomadic: ${herder.isNomadic ? 'Yes' : 'No'}
      - Community Role: ${herder.communityRole}
      - Average Income per Season: KSh ${herder.avgIncomePerSeason}

      Generate a customized, hypothetical 4-installment loan repayment schedule for a KSh 100,000 loan.
      Base the schedule on pastoral cycles, seasonal income patterns, livestock sales timing, and drought cycles in Kenya.
      Consider that pastoralists often have irregular income due to seasonal variations and climate conditions.
      For each installment, provide a suggested date (month and year) and a brief reasoning for that timing.
      The current date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}.
      Provide the output in JSON format as an array of objects with: installment (number), amount (number), suggestedDate (string), reasoning (string).`;
    
    const responseSchema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          installment: { type: SchemaType.NUMBER },
          amount: { type: SchemaType.NUMBER },
          suggestedDate: { type: SchemaType.STRING },
          reasoning: { type: SchemaType.STRING },
        },
        required: ['installment', 'amount', 'suggestedDate', 'reasoning'] as string[],
      },
    };

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        }
      });
      
      const response = result.response;
      const text = response.text();
      const plan = JSON.parse(text);
      setRepaymentPlan(plan);
    } catch (error) {
      console.error("AI plan generation failed:", error);
      setAiError("Failed to generate a repayment plan. The AI may be unavailable right now.");
    } finally {
      setIsGeneratingPlan(false);
    }
  }, []);

  const handleGeneratePlan = useCallback((herder: Herder) => {
    setSelectedHerder(null); // Close detail modal
    setAiModalHerder(herder);
    setIsAiModalOpen(true);
    setIsGeneratingPlan(true);
    setRepaymentPlan(null);
    setAiError(null);
    fetchAiRepaymentPlan(herder);
  }, [fetchAiRepaymentPlan]);

  const handleCloseAiModal = useCallback(() => {
    setIsAiModalOpen(false);
    setAiModalHerder(null);
    setRepaymentPlan(null);
    setAiError(null);
  }, []);
  
  const filteredAndSortedHerders = useMemo(() => {
    return herders
      .filter(herder => 
        herder.id !== CURRENT_USER_ID && (
          herder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          herder.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          herder.livestock.some(l => l.type.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      )
      .sort((a, b) => {
        if (sortKey === 'trustScore') {
          return b.trustScore - a.trustScore;
        } else if (sortKey === 'herdSize') {
          return b.herdSize - a.herdSize;
        }
        return a.name.localeCompare(b.name);
      });
  }, [herders, sortKey, searchTerm]);

  return (
    <div className="min-h-screen bg-brand-brown-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-6 h-6 text-brand-green-600" />
                <h1 className="text-lg font-bold text-brand-green-800">AgriConnect Pastoral</h1>
              </div>
              {currentUser && (
                <button
                  onClick={() => handleSelectHerder(currentUser)}
                  className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={`View your profile, ${currentUser.name}`}
                >
                  <img src={currentUser.avatarUrl} alt="My Profile" className="w-8 h-8 rounded-full border-2 border-brand-green-200" />
                </button>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setIsConnectionsOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-brand-green-50 text-brand-green-800 rounded-full hover:bg-brand-green-100 transition-colors border border-brand-green-200 text-sm"
              >
                <UsersIcon className="w-4 h-4" />
                <span className="font-semibold">My Connections</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-8 h-8 text-brand-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-brand-green-800">AgriConnect Pastoral</h1>
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
                    <div className="h-8 border-l border-gray-200"></div>
                    <button
                      onClick={() => handleSelectHerder(currentUser)}
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('herders')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'herders' 
                    ? 'bg-white text-brand-green-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <UsersIcon className="w-4 h-4 inline mr-2" />
                Herders
              </button>
              <button
                onClick={() => setActiveTab('market')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'market' 
                    ? 'bg-white text-brand-green-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MarketIcon className="w-4 h-4 inline mr-2" />
                Market Intelligence
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'alerts' 
                    ? 'bg-white text-brand-green-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <AlertIcon className="w-4 h-4 inline mr-2" />
                Weather & Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'herders' && (
          <>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-grow">
                   <input 
                    type="text"
                    placeholder="Search by name, location, or livestock type..."
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
                    onChange={(e) => setSortKey(e.target.value as 'trustScore' | 'name' | 'herdSize')}
                    className="border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500 transition-colors bg-brand-brown-50"
                  >
                    <option value="trustScore">Trust Score</option>
                    <option value="herdSize">Herd Size</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredAndSortedHerders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
                {filteredAndSortedHerders.map(herder => (
                  <HerderCard key={herder.id} herder={herder} onSelect={handleSelectHerder} />
                ))}
              </div>
            ) : (
               <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700">No Herders Found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'market' && (
          <MarketIntelligencePanel 
            marketPrices={MOCK_MARKET_PRICES}
            herders={herders}
          />
        )}

        {activeTab === 'alerts' && (
          <WeatherAlertsPanel 
            alerts={MOCK_WEATHER_ALERTS}
            herders={herders}
          />
        )}
      </main>
      
      <HerderDetailModal 
        herder={selectedHerder} 
        onClose={handleCloseModal} 
        onRequestConnection={handleRequestConnection}
        onGeneratePlan={handleGeneratePlan}
        currentUser={currentUser}
      />
      <ConnectionsDashboard 
        isOpen={isConnectionsOpen} 
        onClose={() => setIsConnectionsOpen(false)} 
        user={currentUser}
        allHerders={herders}
        requests={loanRequests}
      />
      <LoanRequestModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        herder={requestTargetHerder}
        onSubmit={handleSubmitLoanRequest}
      />
      <AiRepaymentModal
        isOpen={isAiModalOpen}
        onClose={handleCloseAiModal}
        herder={aiModalHerder}
        plan={repaymentPlan}
        isLoading={isGeneratingPlan}
        error={aiError}
      />
    </div>
  );
};

export default App;
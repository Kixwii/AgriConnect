import React, { useState } from 'react';
import { MarketPrice, Herder } from '../types';
import { MarketIcon, TrendingUpIcon, TrendingDownIcon } from './icons';
import { 
  HeartIcon, 
  UserGroupIcon, 
  CircleStackIcon, 
  TruckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface MarketIntelligencePanelProps {
  marketPrices: MarketPrice[];
  herders: Herder[];
}

const MarketIntelligencePanel: React.FC<MarketIntelligencePanelProps> = ({ marketPrices, herders }) => {
  const [selectedLivestock, setSelectedLivestock] = useState<string>('all');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');

  const livestockTypes = Array.from(new Set(marketPrices.map(p => p.livestockType)));
  const markets = Array.from(new Set(marketPrices.map(p => p.market)));

  const filteredPrices = marketPrices.filter(price => {
    const livestockMatch = selectedLivestock === 'all' || price.livestockType === selectedLivestock;
    const marketMatch = selectedMarket === 'all' || price.market === selectedMarket;
    return livestockMatch && marketMatch;
  });

  const getPriceTrend = (livestockType: string, quality: string) => {
    // Mock trend calculation - in real app, this would compare with historical data
    const trends = ['up', 'down', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
      default: return <ArrowRightIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLivestockIcon = (type: string) => {
    switch (type) {
      case 'cattle': return <HeartIcon className="w-6 h-6 text-brand-green-600" />;
      case 'goats': return <UserGroupIcon className="w-6 h-6 text-brand-green-600" />;
      case 'sheep': return <CircleStackIcon className="w-6 h-6 text-brand-green-600" />;
      case 'camels': return <TruckIcon className="w-6 h-6 text-brand-green-600" />;
      default: return <HeartIcon className="w-6 h-6 text-brand-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <MarketIcon className="w-6 h-6 text-brand-green-600" />
          <h2 className="text-2xl font-bold text-brand-green-800">Market Intelligence</h2>
        </div>
        <p className="text-gray-600">Real-time livestock prices and market trends to help you make informed decisions</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Livestock Type</label>
            <select
              value={selectedLivestock}
              onChange={(e) => setSelectedLivestock(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500"
            >
              <option value="all">All Types</option>
              {livestockTypes.map(type => (
                <option key={type} value={type}>{String(type).charAt(0).toUpperCase() + String(type).slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500"
            >
              <option value="all">All Markets</option>
              {markets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Prices */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Market Prices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livestock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Head</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrices.map((price, index) => {
                const trend = getPriceTrend(price.livestockType, price.quality);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-3">{getLivestockIcon(price.livestockType)}</div>
                        <span className="text-sm font-medium text-gray-900 capitalize">{price.livestockType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        price.quality === 'premium' ? 'bg-green-100 text-green-800' :
                        price.quality === 'standard' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {price.quality}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{price.market}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      KSh {price.pricePerHead.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(trend)}
                        <span className="ml-1 text-xs text-gray-500 capitalize">{trend}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{price.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Best Selling Opportunities</h4>
            <p className="text-sm text-green-700">Premium cattle prices are up 15% in Nairobi markets this week. Consider selling high-quality livestock.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Market Trends</h4>
            <p className="text-sm text-blue-700">Camel milk demand is increasing in urban areas. Good opportunity for dairy-focused herders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligencePanel;

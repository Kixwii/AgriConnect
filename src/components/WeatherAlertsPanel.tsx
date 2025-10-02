import React from 'react';
import { WeatherAlert, Herder } from '../types';
import { AlertIcon } from './icons';
import { 
  SunIcon, 
  CloudIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface WeatherAlertsPanelProps {
  alerts: WeatherAlert[];
  herders: Herder[];
}

const WeatherAlertsPanel: React.FC<WeatherAlertsPanelProps> = ({ alerts, herders }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-200 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'drought': return <SunIcon className="w-8 h-8 text-orange-500" />;
      case 'flood': return <CloudIcon className="w-8 h-8 text-blue-500" />;
      case 'disease_outbreak': return <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />;
      case 'market_opportunity': return <CurrencyDollarIcon className="w-8 h-8 text-green-500" />;
      default: return <ExclamationCircleIcon className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'drought': return 'text-orange-600';
      case 'flood': return 'text-blue-600';
      case 'disease_outbreak': return 'text-red-600';
      case 'market_opportunity': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getAffectedHerders = (alert: WeatherAlert) => {
    return herders.filter(herder => 
      herder.location.toLowerCase().includes(alert.location.toLowerCase().split(',')[0])
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <AlertIcon className="w-6 h-6 text-brand-green-600" />
          <h2 className="text-2xl font-bold text-brand-green-800">Weather & Alerts</h2>
        </div>
        <p className="text-gray-600">Stay informed about weather conditions, market opportunities, and important alerts for pastoralist communities</p>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const affectedHerders = getAffectedHerders(alert);
          return (
            <div key={alert.id} className={`bg-white p-6 rounded-2xl shadow-md border-2 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-lg font-semibold capitalize ${getTypeColor(alert.type)}`}>
                      {alert.type.replace('_', ' ')}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>Valid until: {alert.validUntil}</span>
                    </div>
                  </div>
                  {alert.actionRequired && (
                    <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">Action Required:</p>
                      <p className="text-sm text-gray-700">{alert.actionRequired}</p>
                    </div>
                  )}
                  {affectedHerders.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-800 mb-2">Affected Herders ({affectedHerders.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {affectedHerders.slice(0, 5).map(herder => (
                          <span key={herder.id} className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs">
                            {herder.name}
                          </span>
                        ))}
                        {affectedHerders.length > 5 && (
                          <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs">
                            +{affectedHerders.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Forecast */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Weather Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Kajiado Region</h4>
            <p className="text-sm text-blue-700">Sunny, 28°C. Good grazing conditions expected.</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Garissa Region</h4>
            <p className="text-sm text-orange-700">Hot, 35°C. Limited water availability. Plan accordingly.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Turkana Region</h4>
            <p className="text-sm text-green-700">Partly cloudy, 32°C. Moderate grazing conditions.</p>
          </div>
        </div>
      </div>

      {/* Resource Management Tips */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Management Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Water Management</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Check borehole levels regularly</li>
              <li>Plan water access routes for herds</li>
              <li>Consider water storage solutions</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Pasture Management</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Rotate grazing areas to prevent overgrazing</li>
              <li>Monitor pasture quality and availability</li>
              <li>Plan seasonal migration routes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlertsPanel;

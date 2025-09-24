import React, { useState, FormEvent } from 'react';
import { Farmer } from '../types';
import { PaperAirplaneIcon, CheckCircleIcon } from './icons';

interface LoanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: Farmer | null;
  onSubmit: (amount: number, message: string) => void;
}

const LoanRequestModal: React.FC<LoanRequestModalProps> = ({ isOpen, onClose, farmer, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !farmer) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(numericAmount, message);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleClose = () => {
    setAmount('');
    setMessage('');
    setError('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-transform duration-300 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
      >
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-brand-green-900">Request a Loan</h2>
              <p className="text-gray-500 mt-1">Send a loan request to <span className="font-semibold">{farmer.name}</span>.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className="focus:ring-brand-green-500 focus:border-brand-green-500 block w-full pl-7 pr-4 py-2 sm:text-sm border-gray-300 rounded-md bg-brand-brown-50"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      aria-describedby="amount-error"
                    />
                  </div>
                   {error && <p className="mt-2 text-sm text-red-600" id="amount-error">{error}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="shadow-sm focus:ring-brand-green-500 focus:border-brand-green-500 block w-full sm:text-sm border-gray-300 rounded-md bg-brand-brown-50"
                      placeholder={`E.g., for purchasing new seeds, irrigation equipment, etc.`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:space-x-4 sm:space-x-reverse space-y-2 sm:space-y-0 rounded-b-2xl">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-brand-green-600 hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 disabled:bg-brand-green-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5 mr-2 -ml-1 transform rotate-45" />
                    Send Request
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-8">
            <CheckCircleIcon className="w-16 h-16 text-brand-green-500 mx-auto" />
            <h3 className="mt-4 text-2xl font-bold text-brand-green-900">Request Sent!</h3>
            <p className="mt-2 text-gray-600">Your loan request has been sent to {farmer.name}. You will be notified when they respond.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex justify-center rounded-full border border-transparent shadow-sm px-8 py-2 bg-brand-green-600 text-base font-medium text-white hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
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

export default LoanRequestModal;
import React, { useState } from 'react';
import axios from 'axios';
import { User, CreditCard, Wallet, Lock, Check, X, Loader2, ChevronDown, Banknote, AlertTriangle } from 'lucide-react';

const accountTypes = ["SAVINGS", "CURRENT", "JOINT"];

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    userId: '',
    type: '',
    balance: '',
    status: 'ACTIVE',
    pin: ''
  });

  const [message, setMessage] = useState({ 
    text: '', 
    type: '', 
    details: [] 
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ text: '', type: '', details: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = [];
    if (!formData.userId) validationErrors.push('User ID is required');
    if (!formData.type) validationErrors.push('Account type is required');
    if (!formData.pin || formData.pin.length < 4) validationErrors.push('PIN must be 4-6 digits');
    if (formData.balance && parseFloat(formData.balance) < 0) validationErrors.push('Balance cannot be negative');

    if (validationErrors.length > 0) {
      setMessage({
        text: 'Validation Error',
        type: 'error',
        details: validationErrors
      });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '', details: [] });

    try {
      const res = await axios.post('http://localhost:8085/api/accounts/create', formData, {
        timeout: 10000
      });
      
      setMessage({
        text: `Account #${res.data.accountNumber} created successfully!`,
        type: 'success',
        details: []
      });
      setShowSuccess(true);
      setFormData({
        userId: '',
        type: '',
        balance: '',
        status: 'ACTIVE',
        pin: ''
      });
    } catch (err) {
      let errorMessage = 'Failed to create account';
      let errorDetails = [];
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = 'Validation Error';
          errorDetails = err.response.data.errors || [err.response.data.message];
        } 
        else if (err.response.status === 409) {
          errorMessage = 'Account Exists';
          errorDetails = ['User already has an account.'];
        }
        else if (err.response.status === 404) {
          errorMessage = 'User Not Found';
          errorDetails = ['The specified user ID does not exist'];
        }
        else if (err.response.status >= 500) {
          errorMessage = 'Server Error';
          errorDetails = ['Please try again later or contact support'];
        }
      } 
      else if (err.request) {
        errorMessage = 'Network Error';
        errorDetails = ['Unable to connect to server. Check your connection.'];
      } 
      else {
        errorMessage = 'Application Error';
        errorDetails = [err.message];
      }

      setMessage({
        text: errorMessage,
        type: 'error',
        details: errorDetails
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

        <div className="p-8 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create New Account</h2>
              <p className="text-sm text-gray-600">Open a new banking account</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter user ID"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="" className="text-gray-400">Select account type</option>
                {accountTypes.map((type) => (
                  <option key={type} value={type} className="text-gray-800">{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Initial Balance (₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Banknote className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Account PIN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="4-6 digits"
                required
                minLength={4}
                maxLength={6}
                pattern="\d{4,6}"
              />
            </div>
          </div>

          {message.type === 'error' && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{message.text}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {message.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-4 px-6 rounded-xl shadow text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-3 h-5 w-5" />
                  Processing...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl text-center max-w-xs">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Success!</h3>
              <p className="text-sm text-gray-600 mb-4">{message.text}</p>
              <div className="bg-blue-50 rounded-lg p-3 mb-6">
                <p className="text-xs text-blue-600">
                  Account details have been sent to your registered email
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
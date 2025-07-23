import React, { useState } from 'react';
import axios from 'axios';

export default function FixedDepositById() {
  const [fdId, setFdId] = useState('');
  const [fdData, setFdData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFDDetails = async () => {
    if (!fdId) {
      setError('Please enter a valid FD/User ID');
      setFdData(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8085/api/fixed-deposit/by-id/${fdId}`);
      setFdData(response.data);
    } catch (err) {
      setFdData(null);
      setError(err.response?.data?.message || 'No record found for this ID');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchFDDetails();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Fixed Deposit Details Lookup</h2>
          <p className="opacity-90">Enter your FD ID to view details</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <label htmlFor="fdId" className="block text-sm font-medium text-gray-700 mb-1">
                FD ID
              </label>
              <input
                id="fdId"
                type="text"
                placeholder="Enter FD ID"
                value={fdId}
                onChange={(e) => setFdId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchFDDetails}
                disabled={loading}
                className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {fdData && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fixed Deposit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail label="FD Number" value={fdData.fdNumber} />
                  <Detail label="Principal Amount" value={`₹${numberWithCommas(fdData.principalAmount)}`} />
                  <Detail label="Interest Rate" value={`${fdData.interestRate}%`} />
                  <Detail label="Tenure (Months)" value={fdData.tenureMonths} />
                  <Detail label="Start Date" value={formatDate(fdData.startDate)} />
                  <Detail label="Maturity Date" value={formatDate(fdData.maturityDate)} />
                  <Detail label="Maturity Amount" value={`₹${numberWithCommas(fdData.maturityAmount)}`} />
                  <Detail label="Status" value={fdData.status} status={true} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, status }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`mt-1 text-sm font-semibold ${status ? getStatusColor(value) : 'text-gray-900'}`}>
        {value}
      </dd>
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getStatusColor(status) {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'text-green-600';
    case 'CLOSED':
      return 'text-red-600';
    case 'MATURED':
      return 'text-purple-600';
    default:
      return 'text-gray-700';
  }
}
import React, { useState } from 'react';
import axios from 'axios';
import { Search, X, Clock, Calendar, Percent, Hash, Wallet, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export default function SearchFDStatement() {
  const [formData, setFormData] = useState({
    accountId: '',
    status: 'ACTIVE',
    startFrom: '',
    startTo: '',
    maturityFrom: '',
    maturityTo: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      accountId: '',
      status: 'ACTIVE',
      startFrom: '',
      startTo: '',
      maturityFrom: '',
      maturityTo: '',
    });
    setResults([]);
    setError('');
  };

  const handleSearch = async () => {
    if (!formData.accountId) {
      setError('Please enter an Account ID');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    try {
      const response = await axios.post(
        'http://localhost:8085/api/fixed-deposit/statement',
        formData
      );
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Fixed Deposit Statement</h2>
              <p className="opacity-90">Search and view your fixed deposit records</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField 
              label="Account ID" 
              name="accountId" 
              value={formData.accountId} 
              onChange={handleChange}
              icon={<Hash className="w-5 h-5 text-gray-400" />}
              required
            />
            
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={['ACTIVE', 'CLOSED']}
              icon={<Wallet className="w-5 h-5 text-gray-400" />}
            />

            <InputField 
              label="Start Date From" 
              name="startFrom" 
              value={formData.startFrom} 
              onChange={handleChange} 
              type="date"
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
            />

            <InputField 
              label="Start Date To" 
              name="startTo" 
              value={formData.startTo} 
              onChange={handleChange} 
              type="date"
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
            />

            <InputField 
              label="Maturity Date From" 
              name="maturityFrom" 
              value={formData.maturityFrom} 
              onChange={handleChange} 
              type="date"
              icon={<Clock className="w-5 h-5 text-gray-400" />}
            />

            <InputField 
              label="Maturity Date To" 
              name="maturityTo" 
              value={formData.maturityTo} 
              onChange={handleChange} 
              type="date"
              icon={<Clock className="w-5 h-5 text-gray-400" />}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Reset
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-800 transition-all ${
                loading ? 'opacity-80 cursor-not-allowed' : ''
              } flex items-center`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="px-6 pb-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">FD Statements</h3>
                <p className="text-sm text-gray-500">{results.length} records found</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FD Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((fd, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fd.fdNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{numberWithCommas(fd.principalAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Percent className="w-4 h-4 text-gray-400 mr-1" />
                            {fd.interestRate}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fd.tenureMonths} months</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(fd.startDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(fd.maturityDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{numberWithCommas(fd.maturityAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            fd.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {fd.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {results.length === 0 && !loading && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No results yet</h3>
              <p className="mt-2 text-gray-500">Enter search criteria and click "Search" to find FD statements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text', icon, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function numberWithCommas(x) {
  if (!x) return '0';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
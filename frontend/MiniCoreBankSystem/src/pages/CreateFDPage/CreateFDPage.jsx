import React, { useState } from 'react';
import axios from 'axios';

export default function CreateFD() {
  const [formData, setFormData] = useState({
    accountId: '',
    principalAmount: '',
    tenureMonths: '',
    isAutoRenewal: false,
  });

  const [fdResult, setFdResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFdResult(null);
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8085/api/fixed-deposit/create', {
        ...formData,
        accountId: Number(formData.accountId),
        principalAmount: Number(formData.principalAmount),
        tenureMonths: Number(formData.tenureMonths),
      });

      setFdResult(response.data);
    } catch (err) {
      setError('Something went wrong while creating FD. Please check the input values.', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Create Fixed Deposit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Account ID"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
          />
          <InputField
            label="Principal Amount (₹)"
            name="principalAmount"
            value={formData.principalAmount}
            onChange={handleChange}
          />
          <InputField
            label="Tenure (Months)"
            name="tenureMonths"
            value={formData.tenureMonths}
            onChange={handleChange}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAutoRenewal"
              checked={formData.isAutoRenewal}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isAutoRenewal" className="text-gray-700">
              Enable Auto-Renewal
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {loading ? 'Creating FD...' : 'Create FD'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

        {fdResult && (
          <div className="mt-6 bg-gray-50 border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">FD Created Successfully</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><b>FD Number:</b> {fdResult.fdNumber}</li>
              <li><b>Principal:</b> ₹{fdResult.principalAmount}</li>
              <li><b>Interest Rate:</b> {fdResult.interestRate}%</li>
              <li><b>Tenure:</b> {fdResult.tenureMonths} months</li>
              <li><b>Start Date:</b> {formatDate(fdResult.startDate)}</li>
              <li><b>Maturity Date:</b> {formatDate(fdResult.maturityDate)}</li>
              <li><b>Maturity Amount:</b> ₹{fdResult.maturityAmount}</li>
              <li><b>Status:</b> <span className={`font-bold ${fdResult.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{fdResult.status}</span></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

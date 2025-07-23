import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const accountTypes = ["SAVINGS", "CURRENT", "JOINT"];

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    userId: '',
    type: '',
    balance: '',
    status: 'ACTIVE',
    pin: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Basic frontend validation
  const validateForm = () => {
    if (!formData.userId.trim()) return "User ID is required";
    if (isNaN(formData.userId) || Number(formData.userId) <= 0) return "User ID must be a positive number";
    if (!formData.type) return "Please select an account type";
    if (!formData.balance.trim()) return "Initial balance is required";
    if (isNaN(formData.balance) || Number(formData.balance) < 0) return "Balance must be a non-negative number";
    if (!formData.pin.trim()) return "Account PIN is required";
    if (formData.pin.length < 4 || formData.pin.length > 6) return "PIN must be 4 to 6 digits";
    if (!/^\d+$/.test(formData.pin)) return "PIN must contain only digits";
    return null; // valid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    const error = validateForm();
    if (error) {
      setMessage(error);
      setIsSuccess(false);
      return;
    }

    setLoading(true);

    try {
      // Prepare data with correct types
      const payload = {
        userId: Number(formData.userId),
        type: formData.type,
        balance: Number(formData.balance),
        status: formData.status,
        pin: formData.pin
      };

      const res = await axios.post('http://localhost:8085/api/accounts/create', payload);

      setMessage(`✅ Account created successfully! Account Number: ${res.data.accountNumber}`);
      setIsSuccess(true);
      setFormData({
        userId: '',
        type: '',
        balance: '',
        status: 'ACTIVE',
        pin: ''
      });
    } catch (err) {
      // Show backend error or generic message
      const errMsg = err.response?.data || 'Something went wrong. Please try again.';
      setMessage(`❌ ${errMsg}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-gray-300 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Open a New Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userId" className="block text-gray-700 font-medium mb-1">User ID</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            min="1"
            placeholder="Enter User ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-gray-700 font-medium mb-1">Account Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          >
            <option value="" disabled>-- Select Account Type --</option>
            {accountTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="balance" className="block text-gray-700 font-medium mb-1">Initial Balance (₹)</label>
          <input
            type="number"
            id="balance"
            name="balance"
            min="0"
            step="0.01"
            value={formData.balance}
            onChange={handleChange}
            placeholder="Minimum ₹0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="pin" className="block text-gray-700 font-medium mb-1">Account PIN</label>
          <input
            type="password"
            id="pin"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            minLength={4}
            maxLength={6}
            pattern="\d*"
            placeholder="4-6 digit PIN"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 flex items-center gap-3 p-4 rounded-lg ${
            isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {isSuccess ? (
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          ) : (
            <XCircleIcon className="w-6 h-6 text-red-600" />
          )}
          <p className="font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}

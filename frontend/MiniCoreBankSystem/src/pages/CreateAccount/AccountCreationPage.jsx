import React, { useState } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:8085/api/accounts/create', formData);
      setMessage(`✅ Account created: ${res.data.accountNumber}`);
    } catch (err) {
      setMessage(`❌ Failed: ${err.response?.data || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">User ID</label>
          <input
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Account Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
          >
            <option value="">-- Select Type --</option>
            {accountTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Initial Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">PIN</label>
          <input
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
            minLength={4}
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 font-medium ${message.startsWith("✅") ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

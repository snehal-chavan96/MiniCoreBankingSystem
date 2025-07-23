import React, { useState } from 'react';
import axios from 'axios';

export default function TransferMoney() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const handleTransfer = async () => {
    setError('');
    setSuccess('');
    
    if (!fromAccount || !toAccount || !amount) {
      setError("Please fill all required fields.");
      return;
    }

    if (fromAccount === toAccount) {
      setError("Sender and receiver account numbers can't be the same.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8085/api/transactions/transfer',
        {
          fromAccountNumber: fromAccount,
          toAccountNumber: toAccount,
          amount: parseFloat(amount),
          remarks: remarks || 'Fund transfer',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setSuccess(`Transaction successful! Txn ID: ${response.data.txnId}`);
      setFromAccount('');
      setToAccount('');
      setAmount('');
      setRemarks('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Transfer Money</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">From Account Number</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            placeholder="e.g. FCX1000000008"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To Account Number</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="e.g. FCX1000000001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Amount (₹)</label>
          <input
            type="number"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <button
          onClick={handleTransfer}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mt-2"
          disabled={loading}
        >
          {loading ? 'Transferring...' : 'Transfer Money'}
        </button>
      </div>
    </div>
  );
}

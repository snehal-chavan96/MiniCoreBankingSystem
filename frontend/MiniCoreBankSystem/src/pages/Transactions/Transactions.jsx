import React, { useState, useEffect } from 'react';

const Transactions = () => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    remarks: ''
  });
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Replace with your backend URL
  const BASE_URL = 'http://localhost:8085';

  // Fetch balance from backend
  useEffect(() => {
    if (formData.fromAccount) {
      fetch(`${BASE_URL}/accounts/${formData.fromAccount}/balance`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch balance');
          return res.json();
        })
        .then((data) => setBalance(data.balance))
        .catch(() => setBalance(0));
    }
  }, [formData.fromAccount]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      setError('Please fill all required fields.');
      return false;
    }
    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than zero.');
      return false;
    }
    if (parseFloat(formData.amount) > balance) {
      setError('Insufficient balance.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowModal(true);
  };

  // Call backend transfer API
  const confirmTransfer = () => {
    setShowModal(false);

    fetch(`${BASE_URL}/transactions/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromAccountId: formData.fromAccount,
        toAccountId: formData.toAccount,
        amount: parseFloat(formData.amount),
        remarks: formData.remarks
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Transfer failed');
        return res.json();
      })
      .then((data) => {
        setTransactionId(`TXN-${Date.now()}`);
        setTransferSuccess(true);
        setBalance(data.balance);
      })
      .catch((err) => setError(err.message));
  };

  const resetForm = () => {
    setFormData({ fromAccount: '', toAccount: '', amount: '', remarks: '' });
    setTransferSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-start py-12">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
          Fund Transfer
        </h2>

        {transferSuccess ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h3 className="text-2xl font-semibold text-green-600">Transfer Successful!</h3>
            <p className="text-slate-600">Transaction ID: <span className="font-bold">{transactionId}</span></p>
            <button
              onClick={resetForm}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transition-transform hover:scale-105"
            >
              Make Another Transfer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">From Account</label>
              <input
                type="text"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleChange}
                placeholder="Enter your account number"
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">To Account</label>
              <input
                type="text"
                name="toAccount"
                value={formData.toAccount}
                onChange={handleChange}
                placeholder="Enter recipient account number"
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Available Balance: ₹{balance}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Remarks (Optional)</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks (if any)"
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-transform hover:scale-105 shadow-lg"
            >
              Proceed to Transfer
            </button>
          </form>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Confirm Transfer</h3>
            <p className="text-slate-600">
              Are you sure you want to transfer <strong>₹{formData.amount}</strong> to account <strong>{formData.toAccount}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransfer}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

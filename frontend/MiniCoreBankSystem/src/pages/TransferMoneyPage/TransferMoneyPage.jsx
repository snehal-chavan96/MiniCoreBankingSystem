import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function TransferMoney() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [txnStatus, setTxnStatus] = useState(''); // 'processing', 'success', 'failed'
  const [txnDetails, setTxnDetails] = useState(null);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchAccount = async () => {
      if (!userId) {
        setError("User not logged in.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8085/api/accounts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setFromAccount(response.data[0].accountNumber);
        } else {
          setError("No account found for user.");
        }
      } catch (err) {
        setError("Failed to fetch account details.",err);
      }
    };

    fetchAccount();
  }, [userId, token]);

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

    setShowPopup(true);
    setTxnStatus('processing');
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

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTxnStatus('success');
      setTxnDetails({
        txnId: response.data.txnId,
        amount: amount,
        fromAccount: fromAccount,
        toAccount: toAccount,
        timestamp: new Date().toLocaleString()
      });

      setTimeout(() => {
        setToAccount('');
        setAmount('');
        setRemarks('');
      }, 3000);
    } catch (err) {
      setTxnStatus('failed');
      setError(err?.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setTxnStatus('');
    setTxnDetails(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 relative font-sans">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Transfer Money</h2>

      {error && !showPopup && <p className="text-red-600 mb-4 px-3 bg-red-50 border border-red-200 rounded">{error}</p>}
      {success && !showPopup && <p className="text-green-600 mb-4 px-3 bg-green-50 border border-green-200 rounded">{success}</p>}

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">From Account Number</label>
          <input
            type="text"
            value={fromAccount}
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">To Account Number</label>
          <input
            type="text"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="e.g. FCX1000000001"
            className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading}
          className={`w-full py-3 mt-1 rounded-md font-semibold text-white transition-all ${
            loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } flex items-center justify-center gap-3`}
        >
          {loading ? (
            <>
              <ArrowPathIcon className="w-6 h-6 animate-spin text-white" />
              Processing...
            </>
          ) : (
            'Transfer Money'
          )}
        </button>
      </div>

      {/* Transaction Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden ring-1 ring-black ring-opacity-5">
            <div className="p-8">
              {txnStatus === 'processing' && (
                <div className="text-center">
                  <ArrowPathIcon className="mx-auto mb-4 h-14 w-14 text-blue-500 animate-spin" />
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">Processing Transaction</h3>
                  <p className="text-gray-600">Please wait while we process your payment.</p>
                </div>
              )}
              {txnStatus === 'success' && (
                <div className="text-center">
                  <CheckCircleIcon className="mx-auto mb-4 h-14 w-14 text-green-500" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Payment Successful!</h3>
                  <div className="bg-gray-50 rounded-lg p-5 text-left space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Amount:</span>
                      <span className="font-medium">₹{amount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>From Account:</span>
                      <span className="font-medium">{fromAccount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>To Account:</span>
                      <span className="font-medium">{toAccount}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Transaction ID:</span>
                      <span className="font-medium">{txnDetails?.txnId}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Time:</span>
                      <span className="font-medium">{txnDetails?.timestamp}</span>
                    </div>
                  </div>
                </div>
              )}
              {txnStatus === 'failed' && (
                <div className="text-center">
                  <XCircleIcon className="mx-auto mb-4 h-14 w-14 text-red-500" />
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">Transaction Failed</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-center">
              <button
                onClick={closePopup}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  txnStatus === 'success'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : txnStatus === 'failed'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {txnStatus === 'processing' ? 'Cancel' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

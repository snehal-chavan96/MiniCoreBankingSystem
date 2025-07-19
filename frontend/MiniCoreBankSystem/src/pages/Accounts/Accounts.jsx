import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Accounts = () => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [viewPin, setViewPin] = useState('');
  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [revealedBalances, setRevealedBalances] = useState({});

 
  const userId = 3;

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`http://localhost:8085/api/accounts/user/${userId}`);
      const accountDetails = response.data.map(account => ({
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        type: account.type,
        balance: account.balance,
        openedAt: account.openedAt,
        closedAt: account.closedAt
      }));
      setAccounts(accountDetails);
      setLoading(false);
    } catch (error) {
      setMessage('Failed to fetch accounts');
      console.error('Error fetching accounts:', error);
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (pin.length !== 6) {
      setMessage('PIN must be 6 digits');
      setIsSubmitting(false);
      return;
    }

    const accountData = {
      userId: userId,
      type,
      balance: parseFloat(balance),
      pin, // Send PIN to backend
      openedAt: new Date().toISOString().split('T')[0],
    };

    try {
      await axios.post('http://localhost:8085/api/accounts/create', accountData);
      setMessage('Account created successfully!');
      setType('');
      setBalance('');
      setPin('');
      fetchAccounts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Account creation failed. Please try again.');
      console.error('AxiosError:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBalance = (accountId) => {
    setCurrentAccountId(accountId);
    setShowPinModal(true);
    setViewPin('');
  };

  const verifyPin = async () => {
    try {
      const account = accounts.find(a => a.accountId === currentAccountId);
      if (!account) throw new Error('Account not found');

      const response = await axios.post('http://localhost:8085/api/accounts/viewbalance', {
        accountNumber: account.accountNumber,
        pin: viewPin
      });

      setRevealedBalances(prev => ({
        ...prev,
        [currentAccountId]: response.data
      }));

      setShowPinModal(false);
      setMessage('Balance revealed successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid PIN. Please try again.');
      setViewPin('');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Accounts</h2>
        <p className="text-gray-600">Loading your accounts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Enter 6-Digit PIN</h3>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={viewPin}
                onChange={(e) => {
                  if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                    setViewPin(e.target.value);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded text-center text-2xl tracking-widest"
                maxLength={6}
                autoFocus
                placeholder="••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setViewPin('');
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={verifyPin}
                disabled={viewPin.length !== 6}
                className={`px-4 py-2 rounded text-white ${viewPin.length === 6 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Accounts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`text-white px-6 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${
            showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
          } shadow-lg`}
        >
          {showForm ? '✕ Cancel' : '＋ Create Account'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateAccount} className="space-y-4 bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2 font-medium">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select account type</option>
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
                <option value="INVESTMENT">Investment</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>

            <div className="form-group">
              <label className="block text-gray-700 mb-2 font-medium">Initial Balance ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-gray-700 mb-2 font-medium">Set 6-Digit PIN</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => {
                    if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                      setPin(e.target.value);
                    }
                  }}
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  maxLength={6}
                  placeholder="Enter 6 digits"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">This PIN will be used to view your account balance</p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || pin.length !== 6}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-300 ${
                isSubmitting || pin.length !== 6
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
              } shadow-md`}
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      {message && (
        <div className={`mt-4 p-4 rounded-lg text-center animate-fade-in ${
          message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.accountId} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-blue-600">
                {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
              </h3>
              <p className="text-gray-500 text-sm mb-2">Account #: {account.accountNumber}</p>
              
              {revealedBalances[account.accountId] !== undefined ? (
                <p className="text-gray-600 mt-2">
                  Balance: <span className="font-bold">${revealedBalances[account.accountId].toFixed(2)}</span>
                </p>
              ) : (
                <p className="text-gray-600 mt-2">
                  Balance: <span className="font-bold">•••••</span>
                </p>
              )}

              <p className="text-gray-500 text-sm mt-3">
                Opened: {new Date(account.openedAt).toLocaleDateString()}
              </p>
              
              <button
                onClick={() => handleViewBalance(account.accountId)}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {revealedBalances[account.accountId] !== undefined ? 'Refresh Balance' : 'View Balance'}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {accounts.length === 0 && !loading && !showForm && "You don't have any accounts yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
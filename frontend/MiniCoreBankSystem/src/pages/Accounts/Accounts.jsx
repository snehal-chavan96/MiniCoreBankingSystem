import { useState, useEffect } from 'react';
import axios from 'axios';

const Accounts = () => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded userId (replace with your actual hardcoded value)
  const userId = 3;

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`http://localhost:8085/api/accounts/user/${userId}`);
      // Extract just the account details from the response
      const accountDetails = response.data.map(account => ({
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        type: account.type,
        balance: account.balance,
        status: account.status,
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

    const accountData = {
      userId: userId, // Using the hardcoded userId
      type,
      balance: parseFloat(balance),
      status,
      openedAt: new Date().toISOString().split('T')[0],
    };

    try {
      await axios.post('http://localhost:8085/api/accounts/create', accountData);
      setMessage('Account created successfully!');
      setType('');
      setBalance('');
      setStatus('');
      fetchAccounts(); // Refresh the accounts list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Account creation failed. Please try again.');
      console.error('AxiosError:', error);
    } finally {
      setIsSubmitting(false);
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
        <form 
          onSubmit={handleCreateAccount} 
          className="space-y-4 bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in"
        >
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
              <label className="block text-gray-700 mb-2 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-300 ${
                isSubmitting 
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
            <div 
              key={account.accountId}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
              </h3>
              <p className="text-gray-500 text-sm mb-2">Account #: {account.accountNumber}</p>
              <p className="text-gray-600 mt-2">
                Balance: <span className="font-bold">${account.balance.toFixed(2)}</span>
              </p>
              <p className="text-gray-600">
                Status: <span className={
                  account.status === 'ACTIVE' ? 'text-green-500' : 
                  account.status === 'CLOSED' ? 'text-red-500' : 'text-yellow-500'
                }>
                  {account.status.charAt(0) + account.status.slice(1).toLowerCase()}
                </span>
              </p>
              <p className="text-gray-500 text-sm mt-3">
                Opened: {new Date(account.openedAt).toLocaleDateString()}
              </p>
              {account.closedAt && (
                <p className="text-gray-500 text-sm">
                  Closed: {new Date(account.closedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {accounts.length === 0 && !loading && "You don't have any accounts yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
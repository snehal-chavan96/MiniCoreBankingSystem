import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    } else {
      setMessage('Username not found.');
      setType('error');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setType('');

    if (!newPassword || !confirmPassword) {
      setType('error');
      setMessage('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setType('error');
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:8085/api/change-password/${username}`, {
        password: newPassword,
      });
      setType('success');
      setMessage(res.data);
      setTimeout(() => navigate('/api/login'), 2000);
    } catch (err) {
      setType('error');
      setMessage(err.response?.data || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-6">
          <h2 className="text-white text-3xl font-bold text-center">Reset Your Password</h2>
          <p className="text-purple-100 text-center text-sm mt-1">Secure your account by setting a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md pl-10"
                placeholder="Enter new password"
              />
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md pl-10"
                placeholder="Confirm new password"
              />
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
            </div>
          </div>

          {message && (
            <div className={`flex items-center space-x-2 text-sm ${type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {type === 'error' ? <ExclamationCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

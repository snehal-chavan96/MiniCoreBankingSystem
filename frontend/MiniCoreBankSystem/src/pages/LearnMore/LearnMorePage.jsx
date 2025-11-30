import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeAccounts, setActiveAccounts] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    fetch('http://localhost:8085/api/getUsers')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setActiveAccounts(data.filter(u => u.status === "ACTIVE").length);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar - unchanged */}
      <aside className="w-72 bg-white/80 border-r border-slate-200/50 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="relative z-10 p-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <span className="text-2xl font-bold text-white">CB</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CoreBank
            </div>
            <div className="text-sm text-slate-500 mt-1">Professional Banking</div>
          </div>
          
          <nav className="space-y-2">
            {[
              { name: 'Dashboard', path: '/api/dashboard', icon: '📊' },
              { name: 'Accounts', path: '/api/accounts', icon: '💰' },
              { name: 'Transactions', path: '/api/transactions', icon: '💳' },
              { name: 'Profile', path: '/api/profile', icon: '👤' },
              { name: 'Terms', path: '/api/terms', icon: '📋' }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-slate-200/50">
            <div className="bg-indigo-50/50 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600">🕒</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Banking Hours</p>
                  <p className="text-xs text-slate-500">Mon-Fri: 9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-12 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl -z-10"></div>
        
        {/* Header with Auth Buttons */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Welcome to CoreBank
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Your premier banking solution with advanced analytics and seamless financial management
            </p>
          </div>
          {!isLoggedIn ? (
            <div className="flex space-x-4">
              <Link
                to="/api/login"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/api/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                navigate("/api/login");
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          )}
        </div>
        
        {/* Stats Cards - Now only 2 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">Total Users</h2>
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {users.length}
              </p>
            </div>
          </div>
          
          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">Active Accounts</h2>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {activeAccounts}
              </p>
            </div>
          </div>
        </div>
        
        {/* Who We Are Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Who We Are?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                CoreBank is a leading financial institution committed to delivering innovative banking solutions with integrity and excellence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Global Presence</h3>
                <p className="text-slate-600">
                  Serving customers in over 40 countries with localized banking solutions tailored to regional needs.
                </p>
              </div>
              
              <div className="p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Innovation Driven</h3>
                <p className="text-slate-600">
                  Pioneering financial technology with AI-powered insights and blockchain-ready infrastructure.
                </p>
              </div>
              
              <div className="p-6 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Customer Centric</h3>
                <p className="text-slate-600">
                  Our relationship managers provide personalized service to help you achieve your financial goals.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-400"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Bank-Level Security</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Your financial data is protected with military-grade encryption and multi-layered security protocols.
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">256-bit SSL</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">2FA</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Biometric</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-400"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Lightning Fast Transfers</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Send money instantly to anyone, anywhere. Our network processes transactions in milliseconds.
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Instant</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">24/7</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">Worldwide</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-white/5"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust CoreBank with their financial needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/api/signup"
                className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Account
              </Link>
              <Link
                to="/api/login"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
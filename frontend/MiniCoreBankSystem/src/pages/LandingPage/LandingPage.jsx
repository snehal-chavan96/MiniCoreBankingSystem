import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Dummy sales data
    setTotalSales(18420);
    setSalesData([
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 6200 },
      { month: 'May', sales: 2200 },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl relative overflow-hidden">
        {/* Glassmorphism background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="relative z-10 p-8 space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <span className="text-2xl font-bold text-white">CB</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CoreBank
            </div>
            <div className="text-sm text-slate-500 mt-1">Professional Banking</div>
          </div>

          {/* Navigation */}
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

          {/* Auth Buttons */}
          <div className="pt-6 border-t border-slate-200/50">
            {!isLoggedIn ? (
              <div className="space-y-3">
                <Link
                  to="/api/login"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
                <Link
                  to="/api/signup"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  navigate("/api/login");
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 space-y-10 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl -z-10"></div>

        {/* Header */}
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Welcome to CoreBank
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Your premier banking solution with advanced analytics and seamless financial management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">Total Sales</h2>
                <span className="text-2xl">💹</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{totalSales.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 mt-2">+12.5% from last month</p>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">Active Accounts</h2>
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                2,847
              </p>
              <p className="text-sm text-slate-500 mt-2">+8.2% from last month</p>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">Transactions</h2>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                45,291
              </p>
              <p className="text-sm text-slate-500 mt-2">+15.3% from last month</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Monthly Sales Overview</h2>
                <p className="text-slate-600">Track your financial performance across months</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-indigo-800">5 Months</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight="500"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(12px)'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'New Transfer', icon: '💸', color: 'from-blue-500 to-cyan-500' },
            { name: 'Pay Bills', icon: '🧾', color: 'from-green-500 to-emerald-500' },
            { name: 'View Reports', icon: '📊', color: 'from-purple-500 to-pink-500' },
            { name: 'Contact Support', icon: '🎧', color: 'from-orange-500 to-red-500' }
          ].map((action, index) => (
            <button
              key={index}
              className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${action.color}`}></div>
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <div className="font-semibold text-slate-700">{action.name}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
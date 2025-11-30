import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

// You would replace this with your actual image import or URL
import backgroundPattern from '../../assets/backgroundImage.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeAccounts: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchUserStats = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/getUsers');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserStats({
          totalUsers: data.length,
          activeAccounts: data.filter(u => u.status === "ACTIVE").length,
          loading: false,
          error: null
        });
      } catch (error) {
        setUserStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CB</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            CoreBank
          </span>
        </div>
        
        {!isLoggedIn ? (
          <div className="flex space-x-4">
            <Link
              to="/api/login"
              className="px-6 py-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/api/signup"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              Create Account
            </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/api/dashboard"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                navigate("/api/login");
              }}
              className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden">
        {/* Background image container with overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${backgroundPattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Modern Banking for{' '}
            <TypeAnimation
              sequence={[
                'Developers',
                2000,
                'Businesses',
                2000,
                'Individuals',
                2000,
                'You',
                2000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            />
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Secure, reliable banking solutions powered by cutting-edge technology
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to={isLoggedIn ? "/api/dashboard" : "/api/signup"}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
            <Link
              to="/api/learnMore"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Our Community</h3>
            {userStats.loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>  
            ) : userStats.error ? (
              <p className="text-red-500">{userStats.error}</p>
            ) : (
              <>
                <p className="text-5xl font-bold text-indigo-600 mb-2">
                  {userStats.totalUsers.toLocaleString()}
                </p>
                <p className="text-slate-600">Registered Users</p>
              </>
            )}
          </div>
          
          
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Why Choose CoreBank?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Bank-Level Security",
              description: "256-bit encryption and multi-factor authentication to protect your assets",
              icon: "🔒"
            },
            {
              title: "Instant Transfers",
              description: "Send money anywhere in seconds with our lightning-fast network",
              icon: "⚡"
            },
            {
              title: "24/7 Support",
              description: "Our team is always available to assist with your banking needs",
              icon: "🛎️"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 mt-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to experience better banking?</h2>
          <p className="text-indigo-100 mb-8">
            Join thousands of satisfied customers who trust CoreBank with their financial needs.
          </p>
          <Link
            to={isLoggedIn ? "/api/dashboard" : "/api/signup"}
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all shadow-lg"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600">
            © {new Date().getFullYear()} CoreBank. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
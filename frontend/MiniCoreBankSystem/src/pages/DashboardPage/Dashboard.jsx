import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Shield, Settings, LogOut,
  Home, Send, Landmark, PiggyBank, BarChart3,
  FileText, HelpCircle, Menu, X, AlertTriangle, CheckCircle, Eye, EyeOff, ChevronDown, ChevronUp,
  Search, Lock, TrendingUp, Clock,
  ChevronRight, Mail, Phone, ArrowRight,
  DollarSign, RefreshCw
} from "lucide-react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTransactionHistory from "../UsersTransactionHistoryPage/UsersTransactionHistoryPage";
import TransferMoney from "../TransferMoneyPage/TransferMoneyPage";
import FetchUserAmount from "../FetchUsersAmmount/FetchUserAmmount";
import SearchFDStatement from '../SearchFDStatement/SearchFDStatement.jsx';
import CreateFD from "../CreateFDPage/CreateFDPage.jsx";
import Chatbot from "../Chatbot/Chatbot.jsx";

const Dashboard = () => {
  const [state, setState] = useState({
    sidebarOpen: false,
    balanceVisible: true,
    currentView: 'dashboard',
    expandedFaq: null,
    searchTerm: '',
    interestPrincipal: '',
    interestRate: '',
    interestTime: '',
    interestResult: null,
    interestType: 'simple',
    compoundFrequency: '1',
    accountNumber: '',
    ifsc: '',
    userDetails: null,
    apiModules: [],
    loadingUserDetails: true,
    loadingAccount: true,
  });
  const joinMeeting = () => {
    const roomName = "my-room-123"; // you can generate this dynamically
    navigate(`/video-call/${roomName}`);
  };

  const [showProfileCard, setShowProfileCard] = useState(false);
  const [revealAccountNumber, setRevealAccountNumber] = useState(false);
  const [revealIfsc, setRevealIfsc] = useState(false);

  const username = sessionStorage.getItem("username") || "";
  const role = sessionStorage.getItem("role") || "user";
  const status = sessionStorage.getItem("status") || "INACTIVE";
  const userId = sessionStorage.getItem("userId");
  const isActive = status === "ACTIVE";
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !localStorage.getItem("token")) {
      navigate("/api/login");
    } else {
      fetchAccountInfo();
      fetchUserDetails();
      fetchApiModules();
    }
  }, [navigate, userId, username]);

  const fetchAccountInfo = async () => {
    setState(prev => ({ ...prev, loadingAccount: true }));
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:8085/api/accounts/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setState(prev => ({
            ...prev,
            accountNumber: data[0].accountNumber,
            ifsc: data[0].ifscCode || data[0].ifsc || "CORE9658415",
            loadingAccount: false
          }));
        } else {
          setState(prev => ({ ...prev, loadingAccount: false }));
        }
      } else {
        setState(prev => ({ ...prev, loadingAccount: false }));
      }
    } catch {
      setState(prev => ({ ...prev, loadingAccount: false }));
    }
  };

  // THIS fetches from port 8085 as your Postman screenshot shows
  const fetchUserDetails = async () => {
    setState(prev => ({ ...prev, loadingUserDetails: true }));
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:8085/api/user/details/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          userDetails: data,
          loadingUserDetails: false
        }));
      } else {
        setState(prev => ({ ...prev, loadingUserDetails: false }));
      }
    } catch {
      setState(prev => ({ ...prev, loadingUserDetails: false }));
    }
  };

  const fetchApiModules = () => {
    const modules = [
      { name: "SignUpRelated Module", status: "active" },
      { name: "Login Related Module", status: "active" },
      { name: "KYC Related Module", status: isActive ? "active" : "inactive" },
      { name: "Account Related Module", status: "active" },
      { name: "Funds Transfer Module", status: isActive ? "active" : "pending" },
      { name: "Fixed Deposit Module", status: "active" },
      { name: "OTP Module", status: "active" }
    ];
    setState(prev => ({ ...prev, apiModules: modules }));
  };

  const handleChange = (key, value) => setState(prev => ({ ...prev, [key]: value }));

  function maskAccountNumber(num) {
    if (!num) return "************";
    return "XXXXXXX" + String(num).slice(-4);
  }
  function maskIfscCode(ifsc) {
    if (!ifsc) return "****";
    if (ifsc.length > 4) return ifsc.slice(0, 4) + "****";
    return "****";
  }

  function UserProfileCard() {
    return (
      <div className="absolute right-0 top-14 bg-white shadow-2xl border border-gray-200 rounded-xl w-96 z-50 p-6">
        <div className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">{username}</div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                  {role} Account
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowProfileCard(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Account Number</span>
                <button
                  onClick={() => setRevealAccountNumber(!revealAccountNumber)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  {revealAccountNumber ? (<><EyeOff className="w-4 h-4 mr-1" /> Hide</>)
                    : (<><Eye className="w-4 h-4 mr-1" /> Show</>)
                  }
                </button>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg font-mono tracking-wider border border-gray-200 text-gray-900">
                {revealAccountNumber
                  ? (state.accountNumber || (<span className="text-gray-400">Not Fetched</span>))
                  : maskAccountNumber(state.accountNumber)}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">IFSC Code</span>
                <button
                  onClick={() => setRevealIfsc(!revealIfsc)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  {revealIfsc ? (<><EyeOff className="w-4 h-4 mr-1" /> Hide</>)
                    : (<><Eye className="w-4 h-4 mr-1" /> Show</>)
                  }
                </button>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg font-mono tracking-wider border border-gray-200 text-gray-900">
                {revealIfsc
                  ? (state.ifsc || "Not Fetched")
                  : maskIfscCode(state.ifsc)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isActive ? (
                  <CheckCircle className="inline w-3 h-3 mr-1" />
                ) : (
                  <AlertTriangle className="inline w-3 h-3 mr-1" />
                )}
                {status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4 text-indigo-500" />
              <span className="truncate">
                {state.loadingUserDetails
                  ? <span className="text-gray-400">Loading...</span>
                  : (state.userDetails?.emailId || "Not provided")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span>
                {state.loadingUserDetails
                  ? <span className="text-gray-400">Loading...</span>
                  : (state.userDetails?.phoneNumber || "Not provided")}
              </span>
            </div>
          </div>
          <button
            className="w-full mt-6 py-3 px-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium flex items-center justify-center space-x-2"
            onClick={() => {
              localStorage.removeItem("token");
              sessionStorage.clear();
              navigate("/api/login");
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  const data = {
    faq: [
      { question: "How do I reset my password?", answer: "You can reset your password by clicking 'Forgot Password' on the login page." },
      { question: "How do I print my transaction statement?", answer: "Go to Transactions > Print Statement > Print / Download" },
      { question: "Why is my account locked?", answer: "New accounts are inactive by default. Complete KYC to activate." },
      { question: "How do I report suspicious activity?", answer: "Use 'Report Issue' or call our fraud hotline at 9421083455." }
    ],
    sidebarItems: [
      { icon: Home, label: "Dashboard", view: 'dashboard' },
      { icon: DollarSign, label: "Account Balance", view: 'balance' },
      { icon: Send, label: "Transfer", view: 'transfer', disabled: !isActive },
      { icon: PiggyBank, label: "Create FD", view: 'createFD' },
      { icon: BarChart3, label: "Interest Calculator", view: 'interestCalculator' },
      { icon: Clock, label: "Transaction History", view: 'transactions' },
      { icon: FileText, label: "Check FD Statement", view: 'searchFDStatement' },
      { icon: Settings, label: "Settings", view: 'settings' },
      { icon: HelpCircle, label: "Support", view: 'support' }
    ],
    quickActions: [
      { icon: Send, label: "Transfer Money", color: "from-blue-500 to-blue-600", disabled: !isActive, action: () => handleChange('currentView', 'transfer') },
      { icon: BarChart3, label: "Calculator", color: "from-green-500 to-green-600", action: () => handleChange('currentView', 'interestCalculator') },
      { icon: FileText, label: "FD Statement", color: "from-amber-500 to-amber-600", action: () => handleChange('currentView', 'searchFDStatement') }
    ]
  };

  const renderContent = () => {
    const views = {
      balance: (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Balance</h2>
          <FetchUserAmount />
        </div>
      ),
      transfer: (
        <div className="w-full">
          <TransferMoney accountNumber={state.accountNumber} />
        </div>
      ),
      transactions: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
          <UserTransactionHistory />
        </div>
      ),
      support: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Support Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact Support</h3>
              <div className="space-y-3">
                <div className="flex items-center"><Mail className="w-5 h-5 text-gray-500 mr-3" /><span>bankpro@gmail.com</span></div>
                <div className="flex items-center"><Phone className="w-5 h-5 text-gray-500 mr-3" /><span>+91 9421083455</span></div>
              </div>
            </div>
            <div className="md:col-span-2 border border-gray-200 rounded-xl p-6 hover:shadow-md">
              <div className="flex items-center mb-6">
                <h3 className="font-semibold text-gray-800">FAQs</h3>
                <div className="relative ml-auto w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search FAQs..." value={state.searchTerm}
                    onChange={(e) => handleChange('searchTerm', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="space-y-4">
                {data.faq.filter(faq => faq.question.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(state.searchTerm.toLowerCase())).map((faq, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <button className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
                        onClick={() => handleChange('expandedFaq', state.expandedFaq === i ? null : i)}>
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {state.expandedFaq === i ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                      </button>
                      {state.expandedFaq === i && <div className="p-4 bg-white text-gray-600 border-t border-gray-100">{faq.answer}</div>}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ),
      settings: (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                sessionStorage.clear();
                navigate("/api/login");
              }}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Profile Information</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">
                    {state.loadingUserDetails ? "Loading..." : (state.userDetails?.fullName || username)}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">{role} Account</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username</span>
                  <span className="font-medium">{state.userDetails?.username || username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{state.loadingUserDetails ? "Loading..." : (state.userDetails?.emailId || "Not provided")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{state.loadingUserDetails ? "Loading..." : (state.userDetails?.phoneNumber || "Not provided")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Created</span>
                  <span className="font-medium">
                    {state.userDetails?.createdAt ? new Date(state.userDetails.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Security</h3>
              <div className="space-y-4">
                <button onClick={() => navigate("/api/forgot-password")}
                  className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Change Password</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-500 mr-3" />
                      <span>Account Status</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {status}
                    </span>
                  </div>
                  {!isActive && (
                    <p className="mt-2 text-sm text-gray-600">
                      Complete KYC verification to activate all account features.
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">API Modules Status</h4>
                  <div className="space-y-2">
                    {state.apiModules.map((module, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{module.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          module.status === 'active' ? 'bg-green-100 text-green-700' :
                            module.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {module.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      interestCalculator: (
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 mx-auto">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-7 h-7 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Interest Calculator</h2>
          </div>
          <div className="flex mb-6 space-x-2">
            {['simple', 'compound'].map(type => (
              <button key={type} type="button" onClick={() => handleChange('interestType', type)}
                className={`flex-1 py-2 rounded-lg font-medium ${state.interestType === type ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}>
                {type === 'simple' ? 'Simple Interest' : 'Compound Interest'}
              </button>
            ))}
          </div>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const P = parseFloat(state.interestPrincipal);
            const R = parseFloat(state.interestRate);
            const T = parseFloat(state.interestTime);
            const N = parseInt(state.compoundFrequency);
            if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R <= 0 || T <= 0 ||
              (state.interestType === 'compound' && (isNaN(N) || N <= 0))) {
              handleChange('interestResult', "Please enter valid positive numbers.");
              return;
            }
            if (state.interestType === 'simple') {
              const SI = (P * R * T) / 100;
              handleChange('interestResult', `Simple Interest: ₹${SI.toFixed(2)} | Total: ₹${(P + SI).toFixed(2)}`);
            } else {
              const A = P * Math.pow(1 + (R / (100 * N)), N * T);
              const CI = A - P;
              handleChange('interestResult', `Compound Interest: ₹${CI.toFixed(2)} | Total: ₹${A.toFixed(2)}`);
            }
          }}>
            {['Principal (₹)', 'Rate (%)', 'Time (years)'].map((label, i) => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input type="number" min="0" value={state[['interestPrincipal', 'interestRate', 'interestTime'][i]]}
                  onChange={e => handleChange(['interestPrincipal', 'interestRate', 'interestTime'][i], e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                  required />
              </div>
            ))}
            {state.interestType === 'compound' && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Compounding Frequency</label>
                <select value={state.compoundFrequency} onChange={e => handleChange('compoundFrequency', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-gray-50" required>
                  {['1', '2', '4', '12'].map((val, i) => (
                    <option key={i} value={val}>
                      {['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly'][i]}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button type="submit" className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow">
              Calculate
            </button>
          </form>
          {state.interestResult && (
            <div className="mt-6 flex items-center justify-center">
              <span className="text-lg font-semibold text-indigo-700 bg-indigo-50 px-6 py-3 rounded-lg shadow">
                {state.interestResult}
              </span>
            </div>
          )}
        </div>
      ),
      searchFDStatement: (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Check FD Statement</h2>
          <SearchFDStatement />
        </div>
      ),
      createFD: (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Fixed Deposit</h2>
          <CreateFD />
        </div>
      ),
      dashboard: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.quickActions.map((action, i) => (
              <button key={i} disabled={action.disabled} onClick={action.action}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r ${action.color} ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}>
                <action.icon className="w-6 h-6 mb-2" />
                {action.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="ml-4 font-semibold text-gray-800">Account Details</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-mono">{maskAccountNumber(state.accountNumber)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IFSC Code</span>
                    <span className="font-mono">{maskIfscCode(state.ifsc)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="ml-4 font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <p className="text-gray-600 mb-4">Check your recent transactions and account activity</p>
                <button
                  onClick={() => handleChange('currentView', 'transactions')}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  View Transaction History <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="ml-4 font-semibold text-gray-800">API Modules</h3>
                </div>
                <div className="space-y-2">
                  {state.apiModules.slice(0, 3).map((module, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 truncate">{module.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        module.status === 'active' ? 'bg-green-100 text-green-700' :
                          module.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {module.status}
                      </span>
                    </div>
                  ))}
                  {state.apiModules.length > 3 && (
                    <button
                      onClick={() => handleChange('currentView', 'settings')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center mt-2"
                    >
                      View all {state.apiModules.length} modules <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {state.userDetails && (
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{state.userDetails.fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{state.loadingUserDetails ? "Loading..." : (state.userDetails?.emailId || "Not provided")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{state.loadingUserDetails ? "Loading..." : (state.userDetails?.phoneNumber || "Not provided")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">
                      {state.userDetails.createdAt ? new Date(state.userDetails.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    };
    return views[state.currentView] || views.dashboard;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {state.sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => handleChange('sidebarOpen', false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-700 to-purple-800 text-white transform transition-transform ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold">BankPro</h1>
          </div>
          <button onClick={() => handleChange('sidebarOpen', false)} className="lg:hidden p-1 rounded-md hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 mt-2">
          <div className="px-3 py-2 mb-2 text-xs font-semibold text-white/50 uppercase">Menu</div>
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {data.sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => !item.disabled && handleChange('currentView', item.view)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${state.currentView === item.view ? 'bg-white/10 text-white' : item.disabled ? 'text-white/30 cursor-not-allowed' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                disabled={item.disabled}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.disabled && <Lock className="w-4 h-4 ml-auto text-white/30" />}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white shadow-sm px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => handleChange('sidebarOpen', true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Welcome back, {username}</h1>
                <p className="text-sm text-gray-500">Here's what's happening with your account today</p>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-4 relative">
              <div className="text-right hidden md:block">
                <div className="font-medium text-gray-800">{username}</div>
                <div className="text-xs text-gray-500 capitalize">{role} Account</div>
              </div>
              <button
                onClick={() => setShowProfileCard(card => !card)}
                className="flex items-center justify-center rounded-full hover:ring-2 ring-indigo-500 p-1 bg-gray-100"
                aria-label="Account Menu"
                type="button"
              >
                <User className="w-8 h-8 text-indigo-600" />
              </button>
              {showProfileCard && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileCard(false)} />
                  <UserProfileCard />
                </>
              )}
            </div>
          </div>
        </header>
        {!isActive && (
          <div className="mx-6 mt-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Account Verification Required</h3>
                <p className="text-sm text-red-700">Complete KYC to activate all features</p>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Chatbot />
      {/* <button
      onClick={joinMeeting}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Join Meeting
    </button> */}
    </div>
  );
};

export default Dashboard;

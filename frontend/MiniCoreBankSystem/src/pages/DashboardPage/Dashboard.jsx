import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Shield, Bell, Settings, LogOut, CreditCard, 
  Home, Send, Landmark, PiggyBank, Receipt, BarChart3, 
  FileText, HelpCircle, Menu, X, AlertTriangle, CheckCircle, Eye, EyeOff, ChevronDown, ChevronUp, 
  Search, Lock, Plus, TrendingUp, Wallet, 
  ChevronRight, Mail, Phone, MessageSquare, ArrowRight, 
  DollarSign, RefreshCw
} from "lucide-react";
import CheckAnswer from "../ForgetPasswordModule/ChangePassword";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAccount, setTransferAccount] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentPlan, setInvestmentPlan] = useState('');
  const [interestPrincipal, setInterestPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [interestTime, setInterestTime] = useState('');
  const [interestResult, setInterestResult] = useState(null);
  const [interestType, setInterestType] = useState('simple'); 
  const [compoundFrequency, setCompoundFrequency] = useState('1'); 
  
  const username = sessionStorage.getItem("username") || "User";
  const role = sessionStorage.getItem("role") || "user";
  const status = sessionStorage.getItem("status") || "INACTIVE";
  const isActive = status === "ACTIVE";
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("username") || !localStorage.getItem("token")) {
      navigate("/api/login");
    }
  }, [navigate]);

  const handleSendKYCRequest = () => {
    alert("KYC request sent to admin 👮");
  };

  const handleTransfer = () => {
    if (!transferAmount || !transferAccount) {
      alert("Please fill all fields");
      return;
    }
    alert(`Transfer of ₹${transferAmount} to account ${transferAccount} initiated!`);
    setTransferAmount('');
    setTransferAccount('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInvest = () => {
    if (!investmentAmount || !investmentPlan) {
      alert("Please select a plan and enter amount");
      return;
    }
    alert(`Investment of ₹${investmentAmount} in ${investmentPlan} plan initiated!`);
    setInvestmentAmount('');
    setInvestmentPlan('');
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page. Then enter your username after entering your username you will see the question which you were asked on signup page, enter the answer of your question then change the password"
    },
    {
      question: "How do I print or download my transaction statement?",
      answer: "You can print or download your transaction statement by simply Transactions > Print Statement > Print / Download"
    },
    {
      question: "Why is my account locked?",
      answer: "New accounts are inactive by default. Complete KYC to activate your account."
    },
    {
      question: "How do I report suspicious activity?",
      answer: "Use the 'Report Issue' feature or call our fraud hotline at 9421083455."
    }
  ];

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    { icon: Home, label: "Dashboard", view: 'dashboard' },
    { icon: Send, label: "Transfer", view: 'transfer', disabled: !isActive },
    { icon: Receipt, label: "Transactions", view: 'transactions', disabled: !isActive },
    { icon: PiggyBank, label: "Invest", view: 'invest', disabled: !isActive },
    { icon: BarChart3, label: "Interest Calculator", view: 'interestCalculator' }, 
    { icon: Settings, label: "Settings", view: 'settings' },
    { icon: HelpCircle, label: "Support", view: 'support' },
  ];

  const quickActions = [
    { icon: Send, label: "Send", color: "from-blue-500 to-blue-600", disabled: !isActive, action: () => setCurrentView('transfer') },
    { icon: TrendingUp, label: "Invest", color: "from-orange-500 to-orange-600", disabled: !isActive, action: () => setCurrentView('invest') },
  ];

  const recentTransactions = [
    { id: 1, type: "credit", amount: "₹5,000", desc: "Salary Credit", date: "Today", time: "10:30 AM", icon: Wallet, category: "income" },
    { id: 2, type: "debit", amount: "₹1,200", desc: "Amazon Purchase", date: "Yesterday", time: "3:45 PM", icon: CreditCard, category: "shopping" },
    { id: 3, type: "debit", amount: "₹500", desc: "ATM Withdrawal", date: "2 days ago", time: "6:20 PM", icon: Receipt, category: "cash" },
    { id: 4, type: "credit", amount: "₹2,500", desc: "Freelance Payment", date: "3 days ago", time: "11:15 AM", icon: DollarSign, category: "income" },
    { id: 5, type: "debit", amount: "₹800", desc: "Netflix Subscription", date: "1 week ago", time: "9:00 AM", icon: FileText, category: "entertainment" },
  ];

  const handleClickChangePassword = ()=>{
    navigate("/api/forgot-password");
  }
  

  const investmentPlans = [
    { name: "Savings Plan", return: "5.5%", duration: "1 Year", minAmount: "₹5,000", risk: "Low" },
    { name: "Growth Plan", return: "8.2%", duration: "3 Years", minAmount: "₹10,000", risk: "Medium" },
    { name: "Wealth Plan", return: "12.0%", duration: "5 Years", minAmount: "₹25,000", risk: "High" },
  ];

  const filteredTransactions = activeTab === 'all' 
    ? recentTransactions 
    : recentTransactions.filter(tx => tx.type === activeTab);

  // Improved Interest Calculator Handler
  const handleInterestCalculate = (e) => {
    e.preventDefault();
    const P = parseFloat(interestPrincipal);
    const R = parseFloat(interestRate);
    const T = parseFloat(interestTime);
    const N = parseInt(compoundFrequency);

    if (
      isNaN(P) || isNaN(R) || isNaN(T) ||
      P <= 0 || R <= 0 || T <= 0 ||
      (interestType === 'compound' && (isNaN(N) || N <= 0))
    ) {
      setInterestResult("Please enter valid positive numbers.");
      return;
    }

    if (interestType === 'simple') {
      const SI = (P * R * T) / 100;
      setInterestResult(`Simple Interest: ₹${SI.toFixed(2)} | Total: ₹${(P + SI).toFixed(2)}`);
    } else {
      const A = P * Math.pow(1 + (R / (100 * N)), N * T);
      const CI = A - P;
      setInterestResult(`Compound Interest: ₹${CI.toFixed(2)} | Total: ₹${A.toFixed(2)}`);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'transfer':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Money Transfer</h2>
            
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
                  <input
                    type="text"
                    value={transferAccount}
                    onChange={(e) => setTransferAccount(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleTransfer}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all mt-4"
                >
                  Transfer Now
                </button>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-3">Recent Beneficiaries</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">Account: •••• 4567</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium">Acme Corp</p>
                      <p className="text-xs text-gray-500">Account: •••• 8910</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
            
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('credit')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'credit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setActiveTab('debit')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'debit' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={handlePrint}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeTab === 'debit' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Print Statement
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    <tx.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-800">{tx.desc}</h3>
                    <p className="text-xs text-gray-500">{tx.date} • {tx.time}</p>
                  </div>
                  <div className={`font-semibold ${
                    tx.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                <RefreshCw className="w-4 h-4 mr-2" />
                Load More
              </button>
            </div>
          </div>
        );

      case 'invest':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Investment Plan</label>
                    <select
                      value={investmentPlan}
                      onChange={(e) => setInvestmentPlan(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a plan</option>
                      {investmentPlans.map((plan, index) => (
                        <option key={index} value={plan.name}>{plan.name} ({plan.return})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (₹)</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleInvest}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all mt-2"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <h3 className="font-semibold text-gray-800 mb-3">Available Plans</h3>
                <div className="space-y-4">
                  {investmentPlans.map((plan, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800">{plan.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.risk === "Low" ? "bg-green-100 text-green-700" : 
                          plan.risk === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>
                          {plan.risk} Risk
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Returns</p>
                          <p className="font-medium">{plan.return}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-medium">{plan.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Min. Amount</p>
                          <p className="font-medium">{plan.minAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Monthly Spending</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Spending chart will appear here</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Income vs Expenses</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Comparison chart will appear here</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Category Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Shopping', 'Food', 'Entertainment', 'Utilities'].map((category) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500">{category}</p>
                    <p className="font-bold text-gray-800">₹{Math.floor(Math.random() * 5000) + 1000}</p>
                    <p className="text-xs text-gray-500 mt-1">{Math.floor(Math.random() * 30) + 5}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Support Center</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Contact Support</h3>
                <p className="text-gray-600 mb-4">Get in touch with our support team for immediate assistance</p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">bankpro@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">+91 9421083455</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Live Chat</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <h3 className="font-semibold text-gray-800">Frequently Asked Questions</h3>
                  <div className="relative ml-auto w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <button
                        className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleFaq(idx)}
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {expandedFaq === idx ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                      </button>
                      {expandedFaq === idx && (
                        <div className="p-4 bg-white text-gray-600 border-t border-gray-100">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{username}</h3>
                    <p className="text-sm text-gray-500 capitalize">{role} Account</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Security</h3>
                  <div className="space-y-4">
                    <button 
                    onClick={handleClickChangePassword}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <Lock className="w-5 h-5 text-gray-500 mr-3" />
                        <span>Change Password</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    </button>
                  </div>
              </div>
            </div>
          </div>
        );

      case 'interestCalculator':
        return (
          <section className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 mx-auto">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-7 h-7 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
              Interest Calculator
            </h2>
          </div>
          <div className="flex mb-6 space-x-2">
            <button
              type="button"
              onClick={() => setInterestType('simple')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                interestType === 'simple'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'
              }`}
            >
              Simple Interest
            </button>
            <button
              type="button"
              onClick={() => setInterestType('compound')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                interestType === 'compound'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'
              }`}
            >
              Compound Interest
            </button>
          </div>
          <form className="space-y-4" onSubmit={handleInterestCalculate}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Principal (₹)</label>
              <input
                type="number"
                min="0"
                value={interestPrincipal}
                onChange={e => setInterestPrincipal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-base shadow-sm"
                placeholder="Enter amount"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Rate (%)</label>
              <input
                type="number"
                min="0"
                value={interestRate}
                onChange={e => setInterestRate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-base shadow-sm"
                placeholder="Annual rate"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Time (years)</label>
              <input
                type="number"
                min="0"
                value={interestTime}
                onChange={e => setInterestTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-base shadow-sm"
                placeholder="Years"
                required
              />
            </div>
            {interestType === 'compound' && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Compounding Frequency (per year)
                </label>
                <select
                  value={compoundFrequency}
                  onChange={e => setCompoundFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-base shadow-sm"
                  required
                >
                  <option value="1">Yearly</option>
                  <option value="2">Half-Yearly</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold shadow transition-all"
              >
                Calculate
              </button>
            </div>
          </form>
          {interestResult && (
            <div className="mt-6 flex items-center justify-center">
              <span className="text-lg font-semibold text-indigo-700 bg-indigo-50 px-6 py-3 rounded-lg shadow">
                {interestResult}
              </span>
            </div>
          )}
        </div>
      </section>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Total Balance</p>
                  <h2 className="text-3xl font-bold mt-1">
                    {balanceVisible ? "₹1,23,456.78" : "•••••••"}
                  </h2>
                  <p className="text-sm opacity-80 mt-2">Account No. •••• 6789</p>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-between mt-6">
                <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Add Money
                </button>
                <button className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  View Statements
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  disabled={action.disabled}
                  onClick={action.action || (() => {})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r ${action.color} ${
                    action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5 transition-all'
                  }`}
                >
                  <action.icon className="w-6 h-6 mb-2" />
                  {action.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                <button 
                  onClick={() => setCurrentView('transactions')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      <tx.icon className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-800">{tx.desc}</h3>
                      <p className="text-xs text-gray-500">{tx.date} • {tx.time}</p>
                    </div>
                    <div className={`font-semibold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-700 to-purple-800 text-white transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold">BankPro</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 mt-2">
          <div className="px-3 py-2 mb-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
            Menu
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => !item.disabled && setCurrentView(item.view)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.view
                    ? 'bg-white/10 text-white'
                    : item.disabled
                      ? 'text-white/30 cursor-not-allowed'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                disabled={item.disabled}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.disabled && (
                  <Lock className="w-4 h-4 ml-auto text-white/30" />
                )}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              sessionStorage.clear();
              navigate("/api/login");
            }}
            className="flex items-center space-x-3 w-full px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Welcome back, {username}</h1>
                <p className="text-sm text-gray-500">Here's what's happening with your account today</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
              </div>
              <div className={`hidden md:flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isActive ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                <span>{status}</span>
              </div>
            </div>
          </div>
        </header>

        {!isActive && (
          <div className="mx-6 mt-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Account Verification Required</h3>
                  <p className="text-sm text-red-700">Complete KYC to activate all features</p>
                </div>
              </div>
              <button
                onClick={handleSendKYCRequest}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all"
              >
                Verify Now
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
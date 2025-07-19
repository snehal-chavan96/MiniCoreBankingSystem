import React, { useState } from "react";
import { 
  User, Shield, Activity, Bell, Settings, LogOut, CreditCard, 
  Home, Send, Landmark, PiggyBank, Receipt, BarChart3, 
  FileText, HelpCircle, Menu, X, AlertTriangle, CheckCircle,
  ArrowUpRight, ArrowDownLeft, Calendar, Eye, EyeOff
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const username = sessionStorage.getItem("username") || "User";
  const role = sessionStorage.getItem("role") || "user";
  const status = sessionStorage.getItem("status") || "INACTIVE";
  const isActive = status === "ACTIVE";

  const handleSendKYCRequest = () => {
    alert("KYC request sent to admin 👮");
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Send, label: "Transfer Money", href: "/transfer", disabled: !isActive },
    { icon: Receipt, label: "Transactions", href: "/transactions", disabled: !isActive },
    { icon: PiggyBank, label: "Fixed Deposits", href: "/fd", disabled: !isActive },
    { icon: Landmark, label: "Loans", href: "/loans", disabled: !isActive },
    { icon: CreditCard, label: "Cards", href: "/cards", disabled: !isActive },
    { icon: BarChart3, label: "Analytics", href: "/analytics", disabled: !isActive },
    { icon: FileText, label: "Statements", href: "/statements", disabled: !isActive },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Support", href: "/support" },
  ];

  const quickActions = [
    { icon: Send, label: "Send Money", color: "bg-blue-600", disabled: !isActive },
    { icon: Receipt, label: "Pay Bills", color: "bg-green-600", disabled: !isActive },
    { icon: PiggyBank, label: "Open FD", color: "bg-purple-600", disabled: !isActive },
    { icon: CreditCard, label: "Apply Card", color: "bg-orange-600", disabled: !isActive },
  ];

  const recentTransactions = [
    { id: 1, type: "credit", amount: "₹5,000", desc: "Salary Credit", date: "Today", time: "10:30 AM" },
    { id: 2, type: "debit", amount: "₹1,200", desc: "Online Shopping", date: "Yesterday", time: "3:45 PM" },
    { id: 3, type: "debit", amount: "₹500", desc: "ATM Withdrawal", date: "2 days ago", time: "6:20 PM" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">BankPro</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                item.active 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon className={`w-5 h-5 ${item.disabled ? 'text-gray-300' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {item.disabled && (
                <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto" />
              )}
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => window.location.href = "/api/logout"}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Good morning, {username}</h1>
                <p className="text-sm text-gray-500">Welcome back to your dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 capitalize">{role}</span>
              </div>
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isActive ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                <span>{status}</span>
              </div>
            </div>
          </div>
        </header>

        {/* KYC Alert */}
        {!isActive && (
          <div className="mx-6 mt-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Account Verification Required</h3>
                  <p className="text-sm text-red-700">Your account is inactive. Complete KYC verification to access all banking services.</p>
                </div>
              </div>
              <button
                onClick={handleSendKYCRequest}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Verify Now
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-white/80 hover:text-white"
                  disabled={!isActive}
                >
                  {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <h3 className="text-sm font-medium text-blue-100">Available Balance</h3>
              <p className="text-2xl font-bold mt-1">
                {isActive ? (balanceVisible ? "₹1,25,840.50" : "₹••••••••") : "Account Inactive"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">This Month Income</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {isActive ? "₹45,000" : "₹0"}
              </p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">This Month Expenses</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {isActive ? "₹32,450" : "₹0"}
              </p>
              <p className="text-xs text-red-600 mt-1">+8% from last month</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Fixed Deposits</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {isActive ? "₹2,50,000" : "₹0"}
              </p>
              <p className="text-xs text-purple-600 mt-1">3 active deposits</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  disabled={action.disabled}
                  className={`p-4 rounded-lg text-center transition-all duration-200 ${
                    action.disabled 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : `${action.color} hover:opacity-90 text-white transform hover:scale-105`
                  }`}
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            {isActive ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{transaction.desc}</p>
                        <p className="text-sm text-gray-500">{transaction.date} • {transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Complete account verification to view transactions</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Sun, Moon, Lock, LogOut, 
  User, Shield, Bell, CreditCard, Smartphone,
  Mail, Key, Eye, EyeOff, Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Apply theme changes
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password change logic here
    alert('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const settingSections = [
    {
      id: 'account',
      icon: User,
      label: 'Account Settings'
    },
    {
      id: 'security',
      icon: Lock,
      label: 'Security'
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications'
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Appearance'
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'Privacy'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
              </div>
              <nav className="space-y-1 px-2 pb-4">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === section.id
                        ? 'bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <section.icon className="w-5 h-5 mr-3" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Account Information</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            defaultValue="John"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Doe"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue="+1 (555) 123-4567"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Update Profile
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Communication Preferences
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            id="marketing-emails"
                            name="marketing-emails"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="marketing-emails" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Receive marketing emails
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="product-updates"
                            name="product-updates"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="product-updates" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Receive product updates
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Key className="w-5 h-5 mr-2" />
                        Change Password
                      </h4>
                      <form onSubmit={handlePasswordChange}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                id="current-password"
                                name="current-password"
                                type={showPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              New Password
                            </label>
                            <input
                              id="new-password"
                              name="new-password"
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              id="confirm-password"
                              name="confirm-password"
                              type={showPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Two-Factor Authentication
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Active Sessions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last active 2 hours ago</p>
                          </div>
                          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                            Sign out
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Safari on iPhone</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last active 1 day ago</p>
                          </div>
                          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">General Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="notifications-enabled" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Enable Notifications
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive all notifications from BankPro
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="notifications-enabled"
                              name="notifications-enabled"
                              type="checkbox"
                              checked={notificationsEnabled}
                              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Notification Channels</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="email-notifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Email Notifications
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive notifications via email
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="email-notifications"
                              name="email-notifications"
                              type="checkbox"
                              checked={emailNotifications}
                              onChange={() => setEmailNotifications(!emailNotifications)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="sms-notifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              SMS Notifications
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive notifications via text message
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="sms-notifications"
                              name="sms-notifications"
                              type="checkbox"
                              checked={smsNotifications}
                              onChange={() => setSmsNotifications(!smsNotifications)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Notification Types</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="transaction-alerts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Transaction Alerts
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Get notified for all transactions
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="transaction-alerts"
                              name="transaction-alerts"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="security-alerts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Security Alerts
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Important security notifications
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="security-alerts"
                              name="security-alerts"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="promotional-offers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Promotional Offers
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Special offers and promotions
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="promotional-offers"
                              name="promotional-offers"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Appearance</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Theme</h4>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleTheme()}
                          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border ${
                            !darkMode 
                              ? 'border-blue-500 bg-blue-50 dark:bg-gray-600'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Sun className="w-8 h-8 mb-2 text-yellow-500" />
                          <span className="text-sm font-medium">Light Mode</span>
                        </button>
                        <button
                          onClick={() => toggleTheme()}
                          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border ${
                            darkMode 
                              ? 'border-blue-500 bg-blue-50 dark:bg-gray-600'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Moon className="w-8 h-8 mb-2 text-indigo-500" />
                          <span className="text-sm font-medium">Dark Mode</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Font Size</h4>
                      <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                          Small
                        </button>
                        <button className="px-4 py-2 border border-blue-500 bg-blue-50 dark:bg-gray-600 rounded-md">
                          Medium
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                          Large
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Privacy Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Data Sharing</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="analytics-sharing" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Share Analytics Data
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Help us improve by sharing anonymous usage data
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="analytics-sharing"
                              name="analytics-sharing"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="personalized-ads" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Personalized Advertising
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              See ads tailored to your interests
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="personalized-ads"
                              name="personalized-ads"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Account Privacy</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="private-profile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Private Profile
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Hide your profile from other users
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="private-profile"
                              name="private-profile"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="search-visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Search Visibility
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Allow your profile to appear in search results
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="search-visibility"
                              name="search-visibility"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Data Management</h4>
                      <div className="space-y-4">
                        <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Download Your Data</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Request a copy of all your personal data
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Permanently delete your account and all data
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
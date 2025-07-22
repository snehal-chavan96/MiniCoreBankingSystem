import React, { useState } from 'react';
import { 
  Search, Phone, Shield, CreditCard, 
  Smartphone, AlertCircle, Clock, CheckCircle, ChevronDown, 
  ChevronUp, HelpCircle, Lock, DollarSign, Wifi, Settings, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page. Enter your username then you will be asked the question which was asked during SignUp process. After that you will be asked to enter a new password."
    },
    {
      question: "Why is my account locked?",
      answer: "When Account is created, By default its Inactive. You will need to perform KYC to activate your account. As soon as you perform KYC, your account will be activated and you can now use all the features of the banks."
    },
    {
      question: "How do I report a suspicious transaction?",
      answer: "Report suspicious transactions immediately through the app's 'Report Issue' feature or call our fraud hotline at 9421083455. We monitor transactions 24/7 and will investigate within 2 hours of reporting."
    },
    {
      question: "Why was my payment declined?",
      answer: "Payments can be declined due to insufficient funds, exceeded daily limits, suspicious activity detection, or technical issues. Check your account balance and limits, or contact support for specific transaction details."
    },
    {
      question: "What should I do if I lost my phone?",
      answer: "Immediately contact support to secure your account. We'll disable mobile access and help you set up access on a new device. Enable remote wipe if your banking app is still accessible."
    }
  ];

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">BankPro Support Center</h1>
            <p className="mt-2 text-lg text-gray-600">We're here to help with all your banking needs</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/api/user/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>

        {/* Contact Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 sm:mb-0 sm:mr-6">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-gray-900">24/7 Customer Support</h3>
                <p className="mt-1 text-gray-600">Immediate assistance whenever you need it</p>
                <p className="mt-2 text-2xl font-bold text-blue-600">9421083455</p>
                <p className="mt-1 text-sm text-gray-500">Average response time: under 2 minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'faq', label: 'FAQ', icon: HelpCircle },
                { id: 'security', label: 'Security Help', icon: Shield },
                { id: 'status', label: 'Service Status', icon: CheckCircle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center justify-center px-4 py-4 text-sm font-medium whitespace-nowrap ${
                    activeSection === id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* FAQ Section */}
            {activeSection === 'faq' && (
              <div>
                <div className="mb-6">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-5 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-5 pb-4 bg-gray-50">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Help Section */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security & Safety</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Emergency Actions</h3>
                        <ul className="mt-2 text-sm text-red-700 space-y-1">
                          <li>• Unauthorized transaction: Call 9421083455</li>
                          <li>• Lost/stolen card: Freeze card instantly in app</li>
                          <li>• Compromised account: Change password immediately</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Security Best Practices</h3>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                          <li>• Use strong, unique passwords</li>
                          <li>• Enable two-factor authentication</li>
                          <li>• Never share login credentials</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lock className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Security Features</h3>
                        <ul className="mt-2 text-sm text-green-700 space-y-1">
                          <li>• Biometric login (fingerprint/face)</li>
                          <li>• Real-time transaction alerts</li>
                          <li>• Automatic account lockout protection</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Recognize Scams</h3>
                        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                          <li>• We never ask for passwords via email/phone</li>
                          <li>• Check URLs carefully (bankpro.com only)</li>
                          <li>• Don't click suspicious links</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Status Section */}
            {activeSection === 'status' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Status</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {[
                      { service: 'Online Banking', status: 'operational', icon: Wifi },
                      { service: 'Mobile App', status: 'operational', icon: Smartphone },
                      { service: 'Card Transactions', status: 'operational', icon: CreditCard },
                      { service: 'ATM Network', status: 'operational', icon: DollarSign },
                      { service: 'Customer Support', status: 'operational', icon: Phone },
                      { service: 'Wire Transfers', status: 'maintenance', icon: Settings }
                    ].map((item, index) => (
                      <li key={index}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <item.icon className={`h-5 w-5 ${item.status === 'operational' ? 'text-green-500' : 'text-yellow-500'}`} />
                              </div>
                              <p className="ml-4 text-sm font-medium text-gray-900">{item.service}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === 'operational' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status === 'operational' ? 'Operational' : 'Maintenance'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Scheduled Maintenance</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Wire Transfer services will undergo maintenance on Sunday, July 21, 2025, from 2:00 AM to 6:00 AM EST.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
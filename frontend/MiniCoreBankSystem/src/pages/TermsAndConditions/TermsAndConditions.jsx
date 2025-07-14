import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Shield, CreditCard, AlertTriangle, Scale, Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [hasAccepted, setHasAccepted] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleAcceptance = () => {
    setHasAccepted(true);
    setTimeout(() => {
      alert('Thank you for accepting our terms. You may now proceed with your banking services.');
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  const termsData = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="w-5 h-5" />,
      content: `By accessing or using our Core Banking System ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and SecureBank Corp. If you do not agree to these terms, you must immediately cease using our services and close your account.`
    },
    // ... (keep all other term sections exactly as they are)
  ];

  const contactInfo = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: 'legal@securebank.com' },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: '1-800-SECURE-1' },
    { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: '123 Financial District, New York, NY 10005' },
    { icon: <Clock className="w-4 h-4" />, label: 'Hours', value: 'Mon-Fri 9AM-6PM EST' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with bank branding */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">SecureBank</h1>
                  <p className="text-xs text-gray-500">Member FDIC</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-800">Accounts</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-800">Services</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-800">Support</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrint}
                className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Print Terms</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">JS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title and breadcrumbs */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="#" className="text-blue-800 hover:underline">Home</a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <a href="#" className="text-blue-800 hover:underline">Legal</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600" aria-current="page">
                Terms & Conditions
              </li>
            </ol>
          </nav>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
              <p className="text-gray-600 mt-1">Last updated: July 7, 2025</p>
            </div>
            <button
              onClick={handlePrint}
              className="md:hidden flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Important notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <AlertTriangle className="h-5 w-5 text-blue-800" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Legal Notice</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  These Terms and Conditions govern your relationship with SecureBank and use of our services. 
                  Please read them carefully and ensure you understand your rights and obligations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms sections */}
        <div className="space-y-4 mb-8">
          {termsData.map((section, index) => (
            <div key={section.id} className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={expandedSections[section.id]}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      <span className="text-gray-500 mr-2">{index + 1}.</span>
                      {section.title}
                    </h3>
                  </div>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedSections[section.id] && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-3 pl-14">
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact information */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 mt-0.5">
                  {contact.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{contact.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{contact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance section */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <input
                type="checkbox"
                id="accept-terms"
                checked={hasAccepted}
                onChange={(e) => setHasAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-800 border-gray-300 rounded focus:ring-blue-800"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="accept-terms" className="block text-sm font-medium text-gray-900 cursor-pointer">
                I agree to the Terms and Conditions
              </label>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, you acknowledge that you have read and understood all terms above and agree to be bound by them.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAcceptance}
              disabled={!hasAccepted}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                hasAccepted
                  ? 'bg-blue-800 text-white hover:bg-blue-900 shadow-sm'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasAccepted ? 'Continue to Banking' : 'Please Accept Terms'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-xs text-gray-500">
                &copy; 2025 SecureBank, N.A. Member FDIC. Equal Housing Lender. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
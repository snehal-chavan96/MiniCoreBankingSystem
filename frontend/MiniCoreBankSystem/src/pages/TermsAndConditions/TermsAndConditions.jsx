import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, AlertTriangle, Scale, Mail, Phone, MapPin, Clock, CheckCircle, Shield, CreditCard, Users, Lock, FileCheck, AlertCircle, DollarSign, Eye, Gavel, Smartphone } from 'lucide-react';

const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => window.print();

  const termsData = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="w-5 h-5" />,
      content: `By using CoreBank services, you agree to these Terms and Conditions provided by SecureBank Corp. These terms constitute a legally binding agreement between you and SecureBank Corp. Your continued use of our services indicates your acceptance of any updates or modifications to these terms.`
    },
    {
      id: 'account_eligibility',
      title: 'Account Eligibility and Requirements',
      icon: <Users className="w-5 h-5" />,
      content: `To open an account with CoreBank, you must be at least 18 years of age, provide valid identification, and meet our account opening requirements. We reserve the right to refuse service or close accounts that do not meet our eligibility criteria or comply with applicable laws and regulations.`
    },
    {
      id: 'account_responsibilities',
      title: 'Account Holder Responsibilities',
      icon: <FileCheck className="w-5 h-5" />,
      content: `As an account holder, you are responsible for maintaining accurate account information, promptly reporting unauthorized transactions, keeping your login credentials secure, and ensuring sufficient funds for transactions. You must notify us immediately of any changes to your contact information or suspicious account activity.`
    },
    {
      id: 'fees_charges',
      title: 'Fees and Charges',
      icon: <DollarSign className="w-5 h-5" />,
      content: `Various fees may apply to your account including maintenance fees, transaction fees, overdraft fees, and service charges. A complete fee schedule is available upon request and may be updated periodically. We will provide advance notice of fee changes as required by applicable law.`
    },
    {
      id: 'privacy_security',
      title: 'Privacy and Data Security',
      icon: <Shield className="w-5 h-5" />,
      content: `We are committed to protecting your personal and financial information. Our privacy practices are governed by our Privacy Policy, which details how we collect, use, and protect your data. We employ industry-standard security measures to safeguard your information and transactions.`
    },
    {
      id: 'electronic_services',
      title: 'Electronic Banking Services',
      icon: <Smartphone className="w-5 h-5" />,
      content: `Our electronic banking services include online banking, mobile banking, and electronic fund transfers. By using these services, you agree to receive electronic communications and acknowledge that electronic records have the same legal effect as paper records. System availability may vary due to maintenance or technical issues.`
    },
    {
      id: 'card_services',
      title: 'Debit and Credit Card Services',
      icon: <CreditCard className="w-5 h-5" />,
      content: `Debit and credit cards issued by SecureBank are subject to additional terms and conditions. You are responsible for all authorized transactions and must report lost or stolen cards immediately. Daily transaction limits and restrictions may apply to card usage.`
    },
    {
      id: 'fraud_protection',
      title: 'Fraud Prevention and Protection',
      icon: <Lock className="w-5 h-5" />,
      content: `We employ various fraud detection and prevention measures to protect your accounts. You may be contacted to verify suspicious transactions. We are not liable for losses resulting from your failure to follow security procedures or report unauthorized transactions within the specified timeframes.`
    },
    {
      id: 'dispute_resolution',
      title: 'Dispute Resolution and Arbitration',
      icon: <Gavel className="w-5 h-5" />,
      content: `Any disputes arising from your relationship with SecureBank will be resolved through binding arbitration rather than court proceedings, except where prohibited by law. The arbitration will be conducted under the rules of the American Arbitration Association.`
    },
    {
      id: 'account_closure',
      title: 'Account Closure and Termination',
      icon: <AlertCircle className="w-5 h-5" />,
      content: `Either party may terminate the banking relationship at any time with proper notice. We reserve the right to close accounts immediately for violations of these terms, suspicious activity, or as required by law. Upon closure, you remain responsible for any outstanding obligations.`
    },
    {
      id: 'regulatory_compliance',
      title: 'Regulatory Compliance',
      icon: <FileText className="w-5 h-5" />,
      content: `SecureBank operates under federal and state banking regulations. We may be required to report certain transactions to government agencies, freeze accounts, or take other actions to comply with applicable laws including anti-money laundering and know-your-customer requirements.`
    },
    {
      id: 'limitations_liability',
      title: 'Limitations of Liability',
      icon: <Eye className="w-5 h-5" />,
      content: `SecureBank's liability is limited to the extent permitted by law. We are not responsible for indirect, incidental, or consequential damages arising from the use of our services. Our maximum liability for any claim will not exceed the amount of the transaction in question.`
    }
  ];

  const contactInfo = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: 'harrysharma@gmail.com' },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: '+91 9421083455' },
    { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: 'MIT Academy Of Engineering Alandi.' },
    { icon: <Clock className="w-4 h-4" />, label: 'Hours', value: 'Mon-Fri 9AM-6PM EST' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-800 rounded-lg flex justify-center items-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Core Bank</h1>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="hidden md:flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          aria-label="Print Terms"
        >
          <FileText className="w-4 h-4" />
          <span>Print</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        {/* Title */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Terms and Conditions</h2>
          <button
            onClick={handlePrint}
            className="md:hidden flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            aria-label="Print Terms"
          >
            <FileText className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-300 rounded p-3 mb-6 flex items-center space-x-2 text-blue-800 text-sm">
          <AlertTriangle className="w-5 h-5" />
          <p>Please read these Terms carefully to understand your rights and obligations.</p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-3 mb-8">
          {termsData.map(({ id, title, icon, content }, i) => (
            <section key={id} className="bg-white border rounded shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 focus:outline-none"
                aria-expanded={expandedSections[id] || false}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded flex items-center justify-center">{icon}</div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <span className="text-gray-400 mr-1">{i + 1}.</span>{title}
                  </h3>
                </div>
                {expandedSections[id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedSections[id] && (
                <div className="px-6 pb-4 text-gray-700 text-sm leading-relaxed">
                  {content}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Contact info */}
        <div className="bg-white border rounded shadow p-5 mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {contactInfo.map(({ icon, label, value }, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-gray-100 text-gray-600 rounded flex items-center justify-center">{icon}</div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t text-center text-xs text-gray-500 py-4 mt-12">
        &copy; 2025 SecureBank, N.A. Member FDIC. Equal Housing Lender.
      </footer>
    </div>
  );
};

export default TermsAndConditions;
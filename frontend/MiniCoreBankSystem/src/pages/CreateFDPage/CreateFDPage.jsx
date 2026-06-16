import React, { useState, useEffect } from 'react';

export default function CreateFD() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    principalAmount: '',
    tenureMonths: '',
    isAutoRenewal: false,
  });

  const [fdResult, setFdResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const storedFDData = sessionStorage.getItem('fdFormData');
    const isComingFromPayment = sessionStorage.getItem('paymentSuccess');

    if (storedFDData && isComingFromPayment) {
      const parsedData = JSON.parse(storedFDData);
      setFormData(parsedData);
      createFDAfterPayment(parsedData);
      sessionStorage.removeItem('paymentSuccess'); // clear the payment flag
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const calculateMaturityAmount = () => {
    const principal = parseFloat(formData.principalAmount) || 0;
    const tenure = parseInt(formData.tenureMonths) || 0;
    const annualRate = 7.5;
    const maturityAmount = principal * Math.pow(1 + (annualRate / 100) / 12, tenure);
    return maturityAmount.toFixed(2);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.accountId || !formData.principalAmount || !formData.tenureMonths) {
      setError('Please fill in all required fields.');
      return;
    }

    if (parseFloat(formData.principalAmount) < 1000) {
      setError('Minimum deposit amount is ₹1,000.');
      return;
    }

    if (parseInt(formData.tenureMonths) < 6) {
      setError('Minimum tenure is 6 months.');
      return;
    }

    setShowPayment(true);
    setError('');
  };

  const handlePayment = () => {
    sessionStorage.setItem('fdFormData', JSON.stringify(formData));
    sessionStorage.setItem('paymentAmount', formData.principalAmount);
    sessionStorage.setItem('paymentSuccess', 'true');
    window.location.href = '/payment.html'; // assume redirect simulates payment success
  };

  const createFDAfterPayment = async (data) => {
    setFdResult(null);
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8085/api/fixed-deposit/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          accountNumber: Number(data.accountNumber),
          principalAmount: Number(data.principalAmount),
          tenureMonths: Number(data.tenureMonths),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFdResult(result);
        setShowPayment(false);
        sessionStorage.removeItem('fdFormData');
      } else {
        throw new Error('Failed to create FD');
      }
    } catch (err) {
      setError('Something went wrong while creating FD.',err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Fixed Deposit Investment</h1>
          <p className="text-gray-600">Secure your future with our competitive interest rates</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">1</div>
                <h2 className="text-2xl font-bold text-gray-800">Investment Details</h2>
              </div>

              <div onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Account Number"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter your account number"
                    required
                  />
                  <InputField
                    label="Investment Amount (₹)"
                    name="principalAmount"
                    value={formData.principalAmount}
                    onChange={handleChange}
                    placeholder="Minimum ₹1,000"
                    required
                  />
                </div>

                <InputField
                  label="Investment Tenure (Months)"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  placeholder="Minimum 6 months"
                  required
                />

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isAutoRenewal"
                      checked={formData.isAutoRenewal}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <label htmlFor="isAutoRenewal" className="text-gray-800 font-medium">
                        Enable Auto-Renewal
                      </label>
                      <p className="text-sm text-gray-600">Automatically renew your FD at maturity</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Summary</h3>
              <div className="space-y-4">
                <SummaryRow label="Principal Amount" value={`₹${formData.principalAmount || '0'}`} />
                <SummaryRow label="Tenure" value={`${formData.tenureMonths || '0'} months`} />
                <SummaryRow label="Interest Rate" value="7.5% p.a." />
                <SummaryRow label="Maturity Amount" value={`₹${calculateMaturityAmount()}`} highlight />
                <SummaryRow label="Auto Renewal" value={formData.isAutoRenewal ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ready to Invest?</h3>
              <p className="text-gray-600 text-center mb-6">
                You're about to invest ₹{formData.principalAmount} for {formData.tenureMonths} months
              </p>
              <button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg"
              >
                Pay Now - ₹{formData.principalAmount}
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <span className="text-lg font-semibold">Creating your Fixed Deposit...</span>
            </div>
          </div>
        )}

        {/* FD Created Result */}
        {fdResult && (
          <div className="mt-8 bg-white shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">Fixed Deposit Created Successfully!</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FDInfo title="Investment Details" data={{
                'FD Number': fdResult.fdNumber,
                'Principal': `₹${fdResult.principalAmount}`,
                'Interest Rate': `${fdResult.interestRate}%`,
                'Tenure': `${fdResult.tenureMonths} months`
              }} />
              <FDInfo title="Maturity Info" data={{
                'Start Date': formatDate(fdResult.startDate),
                'Maturity Date': formatDate(fdResult.maturityDate),
                'Maturity Amount': `₹${fdResult.maturityAmount}`,
                'Status': fdResult.status
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-green-600 text-lg' : ''}`}>{value}</span>
    </div>
  );
}

function FDInfo({ title, data }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h4 className="font-semibold text-blue-800 mb-3">{title}</h4>
      <div className="space-y-2 text-sm">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600">{key}:</span>
            <span className={`font-medium ${key === 'Status' && val === 'ACTIVE' ? 'text-green-600 font-bold' : ''}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

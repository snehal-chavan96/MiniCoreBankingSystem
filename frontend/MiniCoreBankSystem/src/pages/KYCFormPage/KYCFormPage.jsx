import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  User, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Info,
  Loader2
} from 'lucide-react';

const KYCProcess = () => {
  const [userId, setUserId] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  // Validation patterns
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;

  // Real-time validation
  const handleAadharChange = (e) => {
    let value = e.target.value.replace(/[^\d ]/g, '');
    value = value.replace(/(\d{4})\s?(\d{0,4})\s?(\d{0,4})/, (m, g1, g2, g3) => {
      let out = g1;
      if (g2) out += ' ' + g2;
      if (g3) out += ' ' + g3;
      return out.trim();
    });
    setAadharNumber(value);
    validateField('aadhar', value);
  };

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPanNumber(value);
    validateField('pan', value);
  };

  const handleUserIdChange = (e) => {
    const value = e.target.value;
    setUserId(value);
    validateField('userId', value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocumentFile(file);
    validateField('document', file);
  };

  const validateField = (field, value) => {
    let error = '';
    
    switch(field) {
      case 'aadhar':
        if (!value) error = 'Aadhar is required';
        else if (!aadharRegex.test(value.replace(/\s/g, ''))) 
          error = 'Aadhar must be 12 digits (e.g., 1234 1234 1234)';
        break;
      case 'pan':
        if (!value) error = 'PAN is required';
        else if (!panRegex.test(value)) 
          error = 'PAN must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234E)';
        break;
      case 'userId':
        if (!value) error = 'User ID is required';
        else if (!/^\d+$/.test(value)) error = 'User ID must be numeric';
        break;
      case 'document':
        if (!value) error = 'Document is required';
        else if (value.size > 5 * 1024 * 1024) 
          error = 'File size exceeds 5MB limit';
        else if (!['image/png', 'image/jpeg', 'application/pdf'].includes(value.type)) 
          error = 'Only PNG, JPG, JPEG, PDF files allowed';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    validateField('userId', userId);
    validateField('aadhar', aadharNumber);
    validateField('pan', panNumber);
    validateField('document', documentFile);

    // Check if any errors exist
    if (Object.values(errors).some(error => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('aadharNumber', aadharNumber.replace(/\s/g, ''));
      formData.append('panNumber', panNumber);
      formData.append('documentFile', documentFile);

      const response = await axios.post(
        'http://localhost:8085/api/processKYC',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResponseMessage(response.data.message || 'KYC submitted successfully!');
      
      setTimeout(() => {
        navigate('/api/ShowUsers');
      }, 2000);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || 
        'Failed to process KYC. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
          <p className="text-lg text-gray-600">Complete your Know Your Customer process</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Form Section */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your user ID"
                        value={userId}
                        onChange={handleUserIdChange}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.userId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.userId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.userId}
                      </p>
                    )}
                  </div>

                  {/* Aadhar Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="1234 1234 1234"
                        value={aadharNumber}
                        onChange={handleAadharChange}
                        maxLength={14}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.aadhar ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.aadhar && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.aadhar}
                      </p>
                    )}
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="ABCDE1234E"
                        value={panNumber}
                        onChange={handlePanChange}
                        maxLength={10}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.pan ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.pan && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.pan}
                      </p>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Identity Document
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showInstructions ? 'Hide instructions' : 'View instructions'}
                      </button>
                    </div>
                    
                    {showInstructions && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Info className="w-5 h-5 mr-2" />
                          Document Requirements:
                        </h4>
                        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                          <li>Page 1: Clear copy of your Aadhar card (front)</li>
                          <li>Page 2: Clear copy of your Aadhar card (back)</li>
                          <li>Page 3: Clear copy of your PAN card</li>
                          <li>Page 4: Self-attested declaration (if required)</li>
                        </ol>
                        <p className="text-xs text-blue-600 mt-2">
                          Max file size: 5MB | Format: PDF
                        </p>
                      </div>
                    )}

                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF (MAX. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                    </label>
                    {errors.document && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.document}
                      </p>
                    )}
                    {documentFile && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)}MB)
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Submit KYC Verification'
                    )}
                  </button>
                </form>

                {responseMessage && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    responseMessage.includes('success') 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                  >
                    <div className="flex items-center">
                      {responseMessage.includes('success') ? (
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      <span>{responseMessage}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  KYC Document Guide
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Required Documents</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        Aadhar Card (Front & Back)
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        PAN Card
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        Self-attested declaration
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">How to Prepare PDF</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        Scan all documents clearly
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        Arrange in order: Aadhar front, Aadhar back, PAN card
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        Combine into single PDF file
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>
                        Ensure all text is readable
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Example PDF Structure</h4>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {['Aadhar Front', 'Aadhar Back', 'PAN Card', 'Declaration'].map((page, index) => (
                        <div key={index} className="flex-shrink-0 w-24 h-32 bg-white border border-gray-200 rounded flex flex-col items-center justify-center p-2">
                          <div className="text-xs font-medium text-gray-500 text-center">{page}</div>
                          <div className="text-2xl text-gray-300 mt-2">Page {index+1}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Your PDF should have minimum 3 pages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCProcess;
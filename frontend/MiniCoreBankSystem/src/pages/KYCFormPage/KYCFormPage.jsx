import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;

const KYCProcess = () => {
  const [userId, setUserId] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [aadharError, setAadharError] = useState('');
  const [panError, setPanError] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [fileError, setFileError] = useState('');
  const navigate = useNavigate();

  // Real-time validation handlers
  const handleAadharChange = (e) => {
    let value = e.target.value.replace(/[^\d ]/g, '');
    // Auto-insert spaces for better UX
    value = value.replace(/(\d{4})\s?(\d{0,4})\s?(\d{0,4})/, (m, g1, g2, g3) => {
      let out = g1;
      if (g2) out += ' ' + g2;
      if (g3) out += ' ' + g3;
      return out.trim();
    });
    setAadharNumber(value);
    if (!value) {
      setAadharError('');
    } else if (!aadharRegex.test(value.replace(/\s/g, ''))) {
      setAadharError('Aadhar must be 12 digits (e.g., 1234 1234 1234)');
    } else {
      setAadharError('');
    }
  };

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPanNumber(value);
    if (!value) {
      setPanError('');
    } else if (!panRegex.test(value)) {
      setPanError('PAN must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234E)');
    } else {
      setPanError('');
    }
  };

  const handleUserIdChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setUserId(value);
    if (!value) {
      setUserIdError('');
    } else if (!/^\d+$/.test(value)) {
      setUserIdError('User ID must be numeric');
    } else {
      setUserIdError('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size exceeds 5MB limit.');
        setDocumentFile(null);
        return;
      }
      const acceptedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!acceptedTypes.includes(file.type)) {
        setFileError('Only PNG, JPG, JPEG, PDF files are allowed.');
        setDocumentFile(null);
        return;
      }
      setFileError('');
      setDocumentFile(file);
    } else {
      setFileError('');
      setDocumentFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!userId) {
      setUserIdError('User ID is required');
      valid = false;
    }
    if (!aadharNumber) {
      setAadharError('Aadhar is required');
      valid = false;
    } else if (!aadharRegex.test(aadharNumber.replace(/\s/g, ''))) {
      setAadharError('Aadhar must be 12 digits (e.g., 1234 1234 1234)');
      valid = false;
    }
    if (!panNumber) {
      setPanError('PAN is required');
      valid = false;
    } else if (!panRegex.test(panNumber)) {
      setPanError('PAN must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234E)');
      valid = false;
    }
    if (!documentFile) {
      setFileError('Please upload a document');
      valid = false;
    }
    if (!valid) return;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('aadharNumber', aadharNumber.replace(/\s/g, ''));
    formData.append('panNumber', panNumber);
    formData.append('documentFile', documentFile);

    try {
      const response = await axios.post(
        'http://localhost:8085/api/processKYC',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResponseMessage(response.data);
      setTimeout(() => {
        navigate('/api/ShowUsers');
      }, 2000);
    } catch (error) {
      setResponseMessage(
        error?.response?.data || 'Failed to process KYC. Try again.'
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6 border border-blue-200 mt-8">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">KYC Verification</h1>
      <p className="text-center text-gray-500 mb-4">Please fill in your details to complete KYC</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={handleUserIdChange}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${userIdError ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {userIdError && <p className="text-xs text-red-600 mt-1">{userIdError}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
          <input
            type="text"
            placeholder="1234 1234 1234"
            value={aadharNumber}
            onChange={handleAadharChange}
            maxLength={14}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${aadharError ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {aadharError && <p className="text-xs text-red-600 mt-1">{aadharError}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
          <input
            type="text"
            placeholder="ABCDE1234E"
            value={panNumber}
            onChange={handlePanChange}
            maxLength={10}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${panError ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {panError && <p className="text-xs text-red-600 mt-1">{panError}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Document</label>
          <input
            type="file"
            accept=".jpg,.png,.pdf,.jpeg,.JPG,.PNG,.PDF,.JPEG"
            onChange={handleFileChange}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${fileError ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {fileError && <p className="text-xs text-red-600 mt-1">{fileError}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
        >
          Submit KYC
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-center font-medium text-green-600">
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default KYCProcess;

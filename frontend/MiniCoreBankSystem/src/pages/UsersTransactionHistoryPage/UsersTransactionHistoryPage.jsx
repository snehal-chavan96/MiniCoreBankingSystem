import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function GetAllTransaction() {
  const [accountNumber, setAccountNumber] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const tableRef = useRef();

  // Get token and userId
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  // Fetch account number once on mount
  useEffect(() => {
    if (!userId) {
      setError("User not authenticated (no user ID found).");
      setInputDisabled(true);
      return;
    }
    const fetchAccountNumber = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8085/api/accounts/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // The API returns an array of accounts, we'll take the first one
        if (Array.isArray(res.data) && res.data.length > 0) {
          const firstAccount = res.data[0];
          if (firstAccount.accountNumber) {
            setAccountNumber(firstAccount.accountNumber);
            // Auto-fetch transactions for this account
            fetchTransactions(firstAccount.accountNumber);
          } else {
            setError("Account number not found in the account data.");
          }
        } else {
          setError("No accounts found for this user.");
        }
      } catch (err) {
        console.error("Account fetch error:", err);
        const errorMessage = err.response?.data?.message || "Failed to load account information.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountNumber();
  }, [userId, token]);

  // Fetch transactions for the specified account
  const fetchTransactions = async (accountNum = accountNumber) => {
    setTransactions([]);
    setError('');
    const targetAccount = accountNum || accountNumber;
    
    if (!targetAccount) {
      setError('Account number is required to fetch transactions.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8085/api/transactions/account/${targetAccount}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (res.data && Array.isArray(res.data)) {
        setTransactions(res.data);
        if (res.data.length === 0) {
          setError('No transactions found for this account.');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Transaction fetch error:', err);
      if (err.response) {
        if (err.response.status === 403 || err.response.status === 401) {
          setError('You are not authorized to view these transactions.');
        } else if (err.response.status === 404) {
          setError('Account not found or no transactions available.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred while fetching transactions.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // PDF Download Logic
  const styleCloneRecursively = (element) => {
    element.className = '';
    if (element.style) {
      element.style.color = element.style.color && element.style.color.includes('oklch') ? '#374151' : element.style.color;
      element.style.backgroundColor = element.style.backgroundColor && element.style.backgroundColor.includes('oklch') ? '#fff' : element.style.backgroundColor;
      element.style.borderColor = element.style.borderColor && element.style.borderColor.includes('oklch') ? '#d1d5db' : element.style.borderColor;
      if (element.tagName === 'TH' || element.tagName === 'TD') {
        element.style.padding = '8px';
        element.style.border = '1px solid #d1d5db';
        element.style.textAlign = 'left';
        element.style.color = element.style.color || '#374151';
        element.style.backgroundColor = element.style.backgroundColor || '#fff';
      }
      if (element.tagName === 'TR') {
        element.style.backgroundColor = element.style.backgroundColor || '#fff';
      }
    }
    if (element.children && element.children.length > 0) {
      for (let child of element.children) {
        styleCloneRecursively(child);
      }
    }
  };

  const downloadPDF = async () => {
    if (!tableRef.current || transactions.length === 0) {
      setError("No transactions available to download");
      return;
    }
    setPdfLoading(true);
    setError('');
    try {
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-10000px';
      pdfContainer.style.top = '0';
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.padding = '20px';
      pdfContainer.style.width = '1100px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';

      const tableClone = tableRef.current.cloneNode(true);
      styleCloneRecursively(tableClone);
      pdfContainer.appendChild(tableClone);
      document.body.appendChild(pdfContainer);

      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
      });

      document.body.removeChild(pdfContainer);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`Transactions_${accountNumber}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      setError("Failed to generate PDF. Please try again or use the print function.");
    } finally {
      setPdfLoading(false);
    }
  };

  // UI
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              readOnly
              disabled
              placeholder="Fetching your account number..."
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchTransactions}
              disabled={inputDisabled || !accountNumber || loading}
              className={`h-12 px-6 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : ('Refresh')}
            </button>
            <button
              onClick={downloadPDF}
              disabled={transactions.length === 0 || loading || pdfLoading}
              className={`h-12 px-4 flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors ${
                transactions.length === 0 || loading || pdfLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {pdfLoading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowDownTrayIcon className="w-5 h-5" />
              )}
              {pdfLoading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {loading && transactions.length === 0 && (
          <div className="py-8 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin mb-2" />
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="py-4 px-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!error && !loading && transactions.length === 0 && (
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No transactions to display. Click Refresh to load.</p>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table
              ref={tableRef}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.txnId || txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.txnId}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      txn.txnType === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        txn.txnType === 'CREDIT' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {txn.txnType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.txnTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.fromAccount?.accountNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.toAccount?.accountNumber || '-'}
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      txn.remarks && txn.remarks.includes('Transferred to') 
                        ? 'text-red-600 font-medium' 
                        : txn.remarks && txn.remarks !== '-' 
                        ? 'text-green-600 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {txn.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

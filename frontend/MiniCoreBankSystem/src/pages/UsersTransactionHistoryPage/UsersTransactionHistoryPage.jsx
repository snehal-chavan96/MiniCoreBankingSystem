import React, { useState, useRef } from 'react';
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
  const tableRef = useRef();

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fetch transactions for accountNumber
  const fetchTransactions = async () => {
    setTransactions([]);
    setError('');
    if (!accountNumber) {
      setError('Please enter an account number.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8085/api/transactions/account/${accountNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(res.data);
      if (res.data.length === 0) setError('No transactions found for this account.');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403 || err.response.status === 401) {
          setError("You are not authorized to view transactions for this account.");
        } else {
          setError("Failed to load transactions. Please check the account number.");
        }
      } else {
        setError("Network error or server not reachable.");
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Cleanly clone the table and apply static styles to avoid 'oklch' in computed colors
  const styleCloneRecursively = (element) => {
    element.className = ''; // remove all classes
    if (element.style) {
      // Override all potentially problematic styles:
      element.style.color = element.style.color && element.style.color.includes('oklch') ? '#374151' : element.style.color;
      element.style.backgroundColor = element.style.backgroundColor && element.style.backgroundColor.includes('oklch') ? '#fff' : element.style.backgroundColor;
      element.style.borderColor = element.style.borderColor && element.style.borderColor.includes('oklch') ? '#d1d5db' : element.style.borderColor;
      
      // Add some basic padding, border style fallback for readability in PDF:
      if (element.tagName === 'TH' || element.tagName === 'TD') {
        element.style.padding = '8px';
        element.style.border = '1px solid #d1d5db';
        element.style.textAlign = 'left';
        element.style.color = element.style.color || '#374151';
        element.style.backgroundColor = element.style.backgroundColor || '#fff';
      }
      if (element.tagName === 'TR') {
        // Alternate row colors for readability
        // We can't get index simply here; style a flat color for safety
        element.style.backgroundColor = element.style.backgroundColor || '#fff';
      }
    }
    // Recurse for children:
    if (element.children && element.children.length > 0) {
      for (let child of element.children) {
        styleCloneRecursively(child);
      }
    }
  };

  // PDF download function 
  const downloadPDF = async () => {
    if (!tableRef.current || transactions.length === 0) {
      setError("No transactions available to download");
      return;
    }

    setPdfLoading(true);
    setError('');

    try {
      // Create a temporary invisible container for cloned table
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-10000px'; // off screen
      pdfContainer.style.top = '0';
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.padding = '20px';
      pdfContainer.style.width = '1100px'; // enough width for table
      pdfContainer.style.fontFamily = 'Arial, sans-serif'; // use safe font

      // Clone the table DOM node
      const tableClone = tableRef.current.cloneNode(true);

      // Clean styles and classes recursively, especially to get rid of oklch colors
      styleCloneRecursively(tableClone);

      pdfContainer.appendChild(tableClone);
      document.body.appendChild(pdfContainer);

      // Use html2canvas with high scale for better resolution
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
      });

      // Remove the cloned node from DOM after canvas rendered
      document.body.removeChild(pdfContainer);

      const imgData = canvas.toDataURL('image/png');

      // Create jsPDF landscape A4 — 842 x 595 units approx
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);

      // Calculate fit keeping ratio
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      // Center image in PDF
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      pdf.save(`Transactions_${accountNumber}_${new Date().toISOString().slice(0,10)}.pdf`);
      
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please try again or use the print function.");
    } finally {
      setPdfLoading(false);
    }
  };

  // handle Enter key on input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchTransactions();
    }
  };

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
              onChange={e => setAccountNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter account number (e.g. FCX1000000001)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              autoComplete="off"
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className={`h-12 px-6 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
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
            <p className="text-gray-500">No transactions to display. Enter an account number and click Search.</p>
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
                    <td className="px-6 py-4 text-sm text-gray-500">
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

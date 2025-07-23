import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function GetAllTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const tableRef = useRef(null);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:8085/api/transactions/all');
      setTransactions(res.data || []);
    } catch (err) {
      alert(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Print the transactions table area
  const printTable = () => {
    if (!tableRef.current) return;

    const printContents = tableRef.current.innerHTML;
    const win = window.open('', '', 'width=1024,height=768');
    win.document.write(`
      <html>
        <head>
          <title>Print Transactions</title>
          <style>
            body { font-family: sans-serif; margin: 24px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { padding: 12px 8px; border: 1px solid #e5e7eb; text-align: left; }
            th { background: #f3f4f6; }
            tr:nth-child(even) { background: #f9fafb; }
            .font-semibold { font-weight: 600; }
            .text-green-600 { color: #22c55e; }
            .text-yellow-600 { color: #eab308; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-800 { color: #27272a; }
            .text-xs { font-size: 0.75rem; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          </style>
        </head>
        <body>
          <h2 style="font-size:1.5rem; font-weight: 600; margin-bottom: 1.5rem;">All Transactions</h2>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
      win.close();
    }, 400);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-md font-medium ${
            i === currentPage
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-current={i === currentPage ? 'page' : undefined}
          type="button"
        >
          {i}
        </button>
      );
    }
    return (
      <nav className="flex justify-center space-x-2 my-4" aria-label="Pagination">
        {pages}
      </nav>
    );
  };

  // Helper for status color
  const getStatusBadge = (status) => {
    if (status === "PENDING") {
      return <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 font-semibold text-xs">Pending</span>;
    } else if (status === "SUCCESS") {
      return <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 font-semibold text-xs">Success</span>;
    } else if (status === "FAILED") {
      return <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-semibold text-xs">Failed</span>;
    } else {
      return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold text-xs">{status || "N/A"}</span>;
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Transactions</h2>
        <div className="flex items-center space-x-4">
          {loading && <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />}
          <button
            onClick={printTable}
            disabled={loading || transactions.length === 0}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold transition ${
              loading || transactions.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            type="button"
          >
            Print Transactions
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-lg border border-gray-300 max-h-[600px] shadow-inner"
        ref={tableRef}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-20">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Txn ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">From</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">To</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {!loading && paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => {
                const fromUser = txn?.fromAccount?.user || {};
                const toUser = txn?.toAccount?.user || {};
                const txnId = txn?.txnId ?? 'N/A';
                const amount = txn?.amount ?? 0;
                const dateDisplay = txn?.txnTime ?? 'N/A';
                const remark = txn?.remarks ?? '—';
                const status = txn?.status ?? 'N/A'; // <-- Make sure this matches your API

                return (
                  <tr key={txnId} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{txnId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold">{fromUser.username || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">{fromUser.emailId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold">{toUser.username || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">{toUser.emailId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600 whitespace-nowrap">₹{amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dateDisplay}</td>
                    <td className="px-6 py-4 max-w-sm truncate">{remark}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(status)}</td>
                  </tr>
                );
              })
            ) : (
              !loading && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 font-semibold">
                    No transactions found.
                  </td>
                </tr>
              )
            )}
            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400 font-semibold">
                  Loading transactions...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
}

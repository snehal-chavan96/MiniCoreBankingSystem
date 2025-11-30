import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8085";
const ADMIN_ENDPOINT = `${API_BASE}/api/transactions/admin/txnStmt`;

const pageSizes = [10, 20, 50, 100];

const StatusBadge = ({ status }) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center";
  const cls =
    status === "SUCCESS"
      ? "bg-green-50 text-green-700"
      : status === "FAILED"
      ? "bg-red-50 text-red-700"
      : "bg-yellow-50 text-yellow-700";
  return <span className={`${base} ${cls}`}>{status}</span>;
};

const DemoAdminTransactions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const tableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(ADMIN_ENDPOINT);
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error fetching admin transactions:", e);
        setErr(
          e?.response?.data?.message ||
          e?.message ||
          "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let data = rows;
    if (status !== "ALL") {
      data = data.filter((r) => r.status === status);
    }
    if (fromDate) {
      const from = new Date(fromDate + "T00:00:00");
      data = data.filter((r) => new Date(r.txnTime) >= from);
    }
    if (toDate) {
      const to = new Date(toDate + "T23:59:59");
      data = data.filter((r) => new Date(r.txnTime) <= to);
    }
    if (q.trim()) {
      const tq = q.trim().toLowerCase();
      data = data.filter(
        (r) =>
          (r.referenceId || "").toLowerCase().includes(tq) ||
          (r.fromAccount || "").toLowerCase().includes(tq) ||
          (r.toAccount || "").toLowerCase().includes(tq)
      );
    }
    return data.slice().sort((a, b) => new Date(b.txnTime) - new Date(a.txnTime));
  }, [rows, q, status, fromDate, toDate]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);

  const paged = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const resetPagination = () => setPage(0);
  useEffect(() => {
    resetPagination();
  }, [status, fromDate, toDate, q, pageSize]);

  const exportCSV = () => {
    const headers = [
      "Reference ID",
      "From Account",
      "To Account",
      "Amount",
      "Status",
      "Txn Time",
    ];
    const lines = filtered.map((r) => [
      `"${r.referenceId || ""}"`,
      `"${r.fromAccount || ""}"`,
      `"${r.toAccount || ""}"`,
      `${r.amount ?? ""}`,
      `"${r.status || ""}"`,
      `"${new Date(r.txnTime).toLocaleString()}"`,
    ]);
    const csv = [headers.join(","), ...lines.map(l => l.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateTag = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.download = `admin-transactions-${dateTag}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!tableRef.current) return;

    const printWindow = window.open("", "_blank", "top=100,left=100,height=600,width=800");
    const style = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f3f4f6; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .status-success { color: green; font-weight: bold; }
        .status-failed { color: red; font-weight: bold; }
        .status-pending { color: orange; font-weight: bold; }
      </style>
    `;

    const html = `
      <html>
        <head>
          <title>Transaction Report</title>
          ${style}
        </head>
        <body>
          <h1>Transaction Report</h1>
          ${tableRef.current.outerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all system transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Reference, From, or To"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Print PDF
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden" ref={tableRef}>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-2 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : err ? (
          <div className="p-6 text-center text-red-600 bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 12v.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
            {err}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.length > 0 ? (
                    paged.map((r) => (
                      <tr key={`${r.referenceId}-${r.txnTime}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{r.referenceId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.fromAccount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.toAccount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{Number(r.amount).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.txnTime ? new Date(r.txnTime).toLocaleString() : "—"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No transactions found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination and controls */}
            {filtered.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-200">
                <div className="flex items-center mb-4 md:mb-0">
                  <span className="text-sm text-gray-700 mr-2">Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1 px-2 text-sm"
                  >
                    {pageSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-700 ml-2">entries</span>
                </div>
                <div className="text-sm text-gray-700 mb-4 md:mb-0">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, filtered.length)} of {filtered.length} results
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setPage(0)}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={currentPage >= pageCount - 1}
                    className="relative inline-flex items-center px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setPage(pageCount - 1)}
                    disabled={currentPage >= pageCount - 1}
                    className="relative inline-flex items-center px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DemoAdminTransactions;

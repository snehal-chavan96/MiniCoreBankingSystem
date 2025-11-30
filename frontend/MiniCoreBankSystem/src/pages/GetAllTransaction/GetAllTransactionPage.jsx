import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8085";
const ADMIN_ENDPOINT = `${API_BASE}/api/transactions/admin/txnStmt`;
const pageSizes = [10, 20, 50, 100];

const StatusBadge = ({ status }) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-medium";
  const cls =
    status === "SUCCESS"
      ? "bg-emerald-100 text-emerald-800"
      : status === "FAILED"
      ? "bg-rose-100 text-rose-800"
      : "bg-amber-100 text-amber-800";
  return <span className={`${base} ${cls}`}>{status}</span>;
};

const DemoAdminTransactions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState(""); // search query
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState(""); // yyyy-mm-dd
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const printableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(ADMIN_ENDPOINT);
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load admin transactions"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtering
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
      const to = new Date(toDate + "T23:59:59.999");
      data = data.filter((r) => new Date(r.txnTime) <= to);
    }
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      data = data.filter(
        (r) =>
          (r.referenceId || "").toLowerCase().includes(t) ||
          (r.fromAccount || "").toLowerCase().includes(t) ||
          (r.toAccount || "").toLowerCase().includes(t)
      );
    }
    data = data.slice().sort((a, b) => new Date(b.txnTime) - new Date(a.txnTime));
    return data;
  }, [rows, status, fromDate, toDate, q]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Side-effect: reset page on filter change
  useEffect(() => setPage(0), [status, fromDate, toDate, q, pageSize]);

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Reference ID",
      "From Account",
      "To Account",
      "Amount",
      "Status",
      "Txn Time"
    ];
    const lines = filtered.map((r) => [
      `"${r.referenceId || ""}"`,
      `"${r.fromAccount || ""}"`,
      `"${r.toAccount || ""}"`,
      `${r.amount ?? ""}`,
      `"${r.status || ""}"`,
      `"${new Date(r.txnTime).toLocaleString()}"`
    ]);
    const csv = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateTag = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.download = `admin-transactions-${dateTag}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print handler
  const handlePrint = () => {
    const printContents = printableRef.current.innerHTML;
    const w = window.open("", "PrintWindow", "width=900,height=700");
    w.document.write(`
      <html>
      <head>
        <title>Admin Transactions Print</title>
        <style>
          body { font-family: sans-serif; margin: 40px; color: #222 }
          @media print { body { margin: 0 !important; } }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; }
          th { background: #f8fafc; text-align: left; }
          tr:nth-child(even) { background: #f9fafb; }
          .print-title { font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b }
          .print-meta { margin-bottom: 1rem; color: #64748b; font-size: 0.9rem }
          .status-badge { padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; display: inline-block }
        </style>
      </head>
      <body>
        <div class="print-title">Admin Transactions</div>
        <div class="print-meta">${filtered.length} transactions in view</div>
        ${printContents}
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Transaction Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor and analyze all system transactions</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Reference, From, To"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total Transactions</div>
          <div className="mt-1 text-2xl font-semibold text-slate-800">{rows.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Successful</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {rows.filter(r => r.status === 'SUCCESS').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Failed</div>
          <div className="mt-1 text-2xl font-semibold text-rose-600">
            {rows.filter(r => r.status === 'FAILED').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Pending</div>
          <div className="mt-1 text-2xl font-semibold text-amber-600">
            {rows.filter(r => r.status === 'PENDING').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div ref={printableRef} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading transactions...
          </div>
        ) : err ? (
          <div className="p-6 text-center text-rose-600 bg-rose-50 rounded-lg m-4">
            <svg className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {err}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Reference ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    From
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    To
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {paged.map((r, idx) => (
                  <tr key={`${r.referenceId}-${r.txnTime}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-800">
                      {r.referenceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {r.fromAccount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {r.toAccount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-800">
                      ₹{Number(r.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {r.txnTime ? new Date(r.txnTime).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                      <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="mt-2">No transactions match your filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !err && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium">{filtered.length ? page * pageSize + 1 : 0}</span>
            {" to "}
            <span className="font-medium">{Math.min(filtered.length, page * pageSize + pageSize)}</span>
            {" of "}
            <span className="font-medium">{filtered.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(0)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded-md border border-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              « First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded-md border border-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              ‹ Prev
            </button>
            <span className="px-3 py-1 text-sm text-slate-600">
              Page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{pageCount}</span>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={currentPage >= pageCount - 1}
              className="px-3 py-1 rounded-md border border-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(pageCount - 1)}
              disabled={currentPage >= pageCount - 1}
              className="px-3 py-1 rounded-md border border-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Last »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoAdminTransactions;
import React, { useState } from 'react';
import axios from 'axios';

export default function SearchFDStatement() {
  const [formData, setFormData] = useState({
    accountId: '',
    status: 'ACTIVE',
    startFrom: '',
    startTo: '',
    maturityFrom: '',
    maturityTo: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const response = await axios.post(
        'http://localhost:8085/api/fixed-deposit/statement',
        formData
      );
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch records. Check inputs or backend.', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Search Fixed Deposit Statement</h2>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Account ID" name="accountId" value={formData.accountId} onChange={handleChange} />
          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['ACTIVE', 'CLOSED']}
          />
          <InputField label="Start Date From" name="startFrom" value={formData.startFrom} onChange={handleChange} type="date" />
          <InputField label="Start Date To" name="startTo" value={formData.startTo} onChange={handleChange} type="date" />
          <InputField label="Maturity Date From" name="maturityFrom" value={formData.maturityFrom} onChange={handleChange} type="date" />
          <InputField label="Maturity Date To" name="maturityTo" value={formData.maturityTo} onChange={handleChange} type="date" />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading && <p className="mt-4 text-blue-600 font-semibold">Loading...</p>}
        {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Results:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">FD Number</th>
                    <th className="p-2">Principal</th>
                    <th className="p-2">Interest %</th>
                    <th className="p-2">Tenure (mo)</th>
                    <th className="p-2">Start Date</th>
                    <th className="p-2">Maturity Date</th>
                    <th className="p-2">Maturity Amt</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((fd, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{fd.fdNumber}</td>
                      <td className="p-2">₹{fd.principalAmount}</td>
                      <td className="p-2">{fd.interestRate}%</td>
                      <td className="p-2">{fd.tenureMonths}</td>
                      <td className="p-2">{formatDate(fd.startDate)}</td>
                      <td className="p-2">{formatDate(fd.maturityDate)}</td>
                      <td className="p-2">₹{fd.maturityAmount}</td>
                      <td className={`p-2 font-bold ${fd.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                        {fd.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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

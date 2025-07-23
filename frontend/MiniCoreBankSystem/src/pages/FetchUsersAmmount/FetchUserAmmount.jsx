import React, { useState } from "react";
import axios from "axios";

const FetchUserAmount = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const handleCheckBalance = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8085/api/accounts/viewbalance",
        {
          accountNumber,
          pin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch balance. Check account number or pin.");
      setBalance(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center gap-2">
        🏦 Check Account Balance
      </h2>

      <div className="mb-5">
        <label
          htmlFor="accountNumber"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Account Number
        </label>
        <input
          id="accountNumber"
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="e.g., FCX1000000001"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="pin"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          PIN
        </label>
        <input
          id="pin"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="****"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
      </div>

      <button
        onClick={handleCheckBalance}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-lg shadow-md transition duration-150 ease-in-out focus:ring-4 focus:ring-indigo-300"
        type="button"
      >
        Check Balance
      </button>

      {balance !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-400 rounded-lg text-green-700 font-semibold text-lg shadow-sm">
          💰 Balance: ₹ {balance.toFixed(2)}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-400 rounded-lg text-red-700 font-semibold shadow-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default FetchUserAmount;

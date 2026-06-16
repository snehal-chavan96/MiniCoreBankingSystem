import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Shield, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

const FetchUserAmount = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState("");
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);

  // Fetch user's account number on component mount
  useEffect(() => {
    const fetchAccountNumber = async () => {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");
      
      if (!userId) {
        setAccountError("User not authenticated - Please login again");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/api/accounts/user/${userId}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstAccount = response.data[0];
          if (firstAccount.accountNumber) {
            setAccountNumber(firstAccount.accountNumber);
            setAccountError("");
          } else {
            setAccountError("No account number found in your account details");
          }
        } else {
          setAccountError("No accounts found for your user profile");
        }
      } catch (err) {
        console.error("Account fetch error:", err);
        let errorMessage = "Failed to fetch account information";
        
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = "Session expired - Please login again";
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          errorMessage = "Network error - Could not connect to server";
        }
        
        setAccountError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountNumber();
  }, []);

  const handleCheckBalance = async () => {
    if (!pin || pin.length !== 4) {
      setError("Please enter a valid 4-digit PIN");
      return;
    }

    setIsCheckingBalance(true);
    setError("");
    setBalance(null);

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8085/api/accounts/viewbalance",
        { accountNumber, pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      if (response.data === undefined || response.data === null) {
        throw new Error("Invalid balance response from server");
      }

      setBalance(response.data);
    } catch (err) {
      console.error("Balance check error:", err);
      let errorMessage = "Failed to fetch balance";

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid account number or PIN";
        } else if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (err.response.status === 404) {
          errorMessage = "Account not found";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout - Please try again";
      } else if (err.request) {
        errorMessage = "Network error - Could not connect to server";
      }

      setError(errorMessage);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-full">
          <Shield className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Account Balance</h2>
      </div>

      <div className="space-y-6">
        {/* Account Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={accountNumber}
              readOnly
              disabled={loading}
              placeholder={loading ? "Loading your account..." : "Account number"}
              className={`w-full px-4 py-3 border ${accountError ? 'border-red-300' : 'border-gray-300'} rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                loading ? 'animate-pulse' : ''
              }`}
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          {accountError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{accountError}</span>
            </div>
          )}
        </div>

        {/* PIN Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN
          </label>
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
                setError(""); // Clear error when user types
              }}
              placeholder="Enter 4-digit PIN"
              className={`w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Check Balance Button */}
        <button
          onClick={handleCheckBalance}
          disabled={isCheckingBalance || !accountNumber || pin.length !== 4}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white transition-all ${
            isCheckingBalance || !accountNumber || pin.length !== 4
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md hover:shadow-lg'
          }`}
        >
          {isCheckingBalance ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Balance'
          )}
        </button>

        {/* Balance Display */}
        {balance !== null && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Current Balance</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchUserAmount;
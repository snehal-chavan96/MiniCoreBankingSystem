import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Smartphone, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const OtpPage = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8085/api/otp/send", {
        username,
        phoneNumber: `${phoneNumber}`, // Add +91 prefix before sending
      });

      if (res.data.includes("OTP sent")) {
        setIsOtpSent(true);
        setSuccess("OTP sent successfully!");
      } else {
        setError("OTP not sent. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Validate OTP (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8085/api/otp/verify", {
        phoneNumber: `${phoneNumber}`, // Add +91 prefix before verifying
        otp,
      });

      if (res.data.includes("OTP verified")) {
        navigate("/api/changepassword", { state: { username } });
      } else {
        setError("Incorrect OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-6 text-center">
          <h2 className="text-white text-2xl font-bold">
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </h2>
          <p className="text-purple-100 text-sm mt-1">
            {isOtpSent ? "Enter the 6-digit OTP sent to your phone" : "Enter your details to receive OTP"}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {!isOtpSent ? (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d{0,10}$/.test(value)) {
                        setPhoneNumber(value);
                      }
                    }}
                    maxLength={10}
                    disabled={isLoading}
                  />
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                ) : (
                  <CheckCircle className="mr-2 w-5 h-5" />
                )}
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-800">OTP sent to: +91{phoneNumber}</p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP (6 digits)
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d{0,6}$/.test(value)) {
                        setOtp(value);
                      }
                    }}
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${
                  isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                ) : (
                  <CheckCircle className="mr-2 w-5 h-5" />
                )}
                Verify OTP
              </button>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
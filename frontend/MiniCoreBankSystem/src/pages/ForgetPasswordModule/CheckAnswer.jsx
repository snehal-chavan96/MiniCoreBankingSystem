import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import OTPVerification from "../OTPModulePage/OTPVerificationPage";

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const navigate = useNavigate();

  const fetchQuestion = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const encodedUsername = encodeURIComponent(username);
      const response = await axios.get(`http://localhost:8085/api/security-question/${encodedUsername}`);
      setQuestion(response.data);
      setIsQuestionVisible(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get security question. Please try again.');
      setIsQuestionVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAnswer = async () => {
    if (!answer.trim()) {
      setError('Please enter your answer');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8085/api/verify-answer', {
        username,
        securityAnswer: answer
      });
      navigate("/api/changepassword", { state: { username } });
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerificationClick = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setShowOTPVerification(true);
  };

  if (showOTPVerification) {
    return <OTPVerification username={username} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-6 text-center">
          <h2 className="text-white text-2xl font-bold">Password Recovery</h2>
          <p className="text-purple-100 text-sm mt-1">Answer your security question</p>
        </div>

        <div className="p-6 space-y-4">
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
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {!isQuestionVisible ? (
            <div className="space-y-3">
              <button
                onClick={fetchQuestion}
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                ) : (
                  <Lock className="mr-2 w-5 h-5" />
                )}
                Get Security Question
              </button>
              
              <button
                onClick={handleOTPVerificationClick}
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${
                  isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Lock className="mr-2 w-5 h-5" />
                Verify via OTP Instead
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Question
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-800">{question}</p>
                </div>
              </div>

              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Answer
                </label>
                <input
                  id="answer"
                  type="text"
                  placeholder="Enter your answer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={verifyAnswer}
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
                Verify Answer
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

export default ForgotPassword;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await axios.get(`http://localhost:8085/api/security-question/${encodedUsername}`);
      setQuestion(res.data);
      setIsQuestionVisible(true);
    } catch (err) {
      console.error('Error fetching question:', err);
      setError(err?.response?.data || 'Failed to get the security question.');
      setIsQuestionVisible(false);
      setQuestion('');
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const verifyAnswer = async () => {
    if (!answer.trim()) {
      setError('Please enter your answer');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8085/api/verify-answer', {
        username,
        securityAnswer: answer,
      });
      setSuccess(res.data);
      navigate("/api/changepassword", { state: { username } });
    } catch (err) {
      console.error('Error verifying answer:', err);
      setError(err?.response?.data || 'Incorrect answer.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-6 text-center">
          <h2 className="text-white text-3xl font-bold">Forgot Password</h2>
          <p className="text-purple-100 text-sm mt-1">Answer your security question to reset password</p>
        </div>

        <div className="bg-white p-8 space-y-4">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={fetchQuestion}
            disabled={isLoading}
            className={`w-full py-2 rounded-md font-medium text-white transition ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Get Security Question'}
          </button>

          {isQuestionVisible && (
            <>
              <div>
                <label htmlFor="security-question" className="text-sm font-medium text-gray-700">Security Question</label>
                <input
                  id="security-question"
                  type="text"
                  value={question}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="answer" className="text-sm font-medium text-gray-700">Your Answer</label>
                <input
                  id="answer"
                  type="text"
                  placeholder="Enter your answer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={verifyAnswer}
                disabled={isLoading}
                className={`w-full py-2 rounded-md font-medium text-white transition ${
                  isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify Answer'}
              </button>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md border border-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md border border-green-400 text-sm">
              ✅ {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from "react";
import SignUpImage from "../../assets/SignUpImage.png";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    emailId: "",
    hashPassword: "",
    phoneNumber: "",
    userAnswer: "",
    questionLists: "MOTHERS_MIDDLE_NAME",
    role: "USER",
    status: "INACTIVE",
  });

  const roles = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
  ];

  const securityQuestions = [
    {
      value: "MOTHERS_MIDDLE_NAME",
      label: "What is your mother's middle name?",
    },
    { value: "FIRST_PET_NAME", label: "What is the name of your first pet?" },
    {
      value: "FIRST_HIGHSCHOOL_NAME",
      label: "Where did you attend your first high school?",
    },
    {
      value: "CITY_YOU_GREW_UP",
      label: "Where is the city where you grew up?",
    },
    {
      value: "CHILDHOOD_BOOK_NAME",
      label: "What is your favourite childhood book title?",
    },
  ];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:8085/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      // ✅ Redirect to login after successful signup
      alert("Signup successful! Please log in to continue.");
      navigate("/api/login");

    } catch (err) {
      console.error(err);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        <div className="md:w-2/5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-8 flex flex-col justify-center items-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
            <p className="opacity-90">Be part of the growing financial world</p>
          </div>
          <img
            src={SignUpImage}
            alt="Sign Up Illustration"
            className="w-64 h-auto animate-float"
          />
          <div className="mt-8 text-center text-sm opacity-80">
            <p>Already have an account?</p>
            <a
              href="/api/login"
              className="inline-block mt-2 px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-indigo-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>

        <div className="md:w-3/5 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  pattern="^[A-Za-z ]{3,}$"
                  title="Full name should contain only letters and spaces (min 3 characters)."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Harry James Potter"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  pattern="^[a-zA-Z0-9_.]{4,20}$"
                  title="Username must be 4-20 characters long and can contain letters, numbers, underscores, or dots."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="harrypotter@96"
                />
              </div>
            </div>

            <div>
              <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                id="emailId"
                value={formData.emailId}
                onChange={handleChange}
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Enter a valid email address."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="harry@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hashPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="hashPassword"
                  required
                  value={formData.hashPassword}
                  onChange={handleChange}
                  pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$"
                  title="Password must be at least 8 characters and include letters, numbers, and a special character."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  pattern="^[6-9]\d{9}$"
                  title="Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="9999999999"
                />
              </div>
            </div>

            <div>
              <label htmlFor="questionLists" className="block text-sm font-medium text-gray-700 mb-1">
                Security Question
              </label>
              <select
                name="questionLists"
                required
                value={formData.questionLists}
                onChange={handleSelectChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {securityQuestions.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="userAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <input
                type="text"
                id="userAnswer"
                required
                value={formData.userAnswer}
                onChange={handleChange}
                pattern="^.{2,}$"
                title="Answer must be at least 2 characters long."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Answer to the question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {roles.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{" "}
                  <a
                    href="/api/terms"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Terms and Conditions
                  </a>
                </label>
                <p className="text-gray-500 mt-1">
                  By creating an account, you agree to our privacy policy and
                  terms of service.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!agreeToTerms || isSubmitting}
              className={`w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${
                !agreeToTerms || isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importing all pages based on your folder structure
import LoginPage from './pages/LoginPage/LoginPage';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Accounts from './pages/Accounts/Accounts';
import Transactions from './pages/Transactions/Transactions';
import Profile from './pages/Profile/Profile';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import ChangePassword from './pages/ForgetPasswordModule/ChangePassword';
import CheckAnswer from './pages/ForgetPasswordModule/CheckAnswer';
import LandingPage from './pages/LandingPage/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/api/login" element={<LoginPage />} />
        <Route path="/api/signup" element={<SignUp />} />
        <Route path="/api/dashboard" element={<Dashboard />} />
        <Route path="/api/accounts" element={<Accounts />} />
        <Route path="/api/transactions" element={<Transactions />} />
        <Route path="/api/profile" element={<Profile />} />
        <Route path="/api/terms" element={<TermsAndConditions />} />
        <Route path="/api/forgot-password" element={<CheckAnswer />} />
        <Route path="/api/changepassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
};

export default App;

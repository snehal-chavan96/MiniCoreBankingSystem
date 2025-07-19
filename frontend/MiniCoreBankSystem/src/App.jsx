import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import './index.css';

// Lazy loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Accounts = lazy(() => import('./pages/Accounts/Accounts'));
const Transactions = lazy(() => import('./pages/Transactions/Transactions'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions/TermsAndConditions'));
const ChangePassword = lazy(() => import('./pages/ForgetPasswordModule/ChangePassword'));
const CheckAnswer = lazy(() => import('./pages/ForgetPasswordModule/CheckAnswer'));
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const ShowUsersData = lazy(()=> import('./pages/ShowUsersData/ShowUsersData'));
const KYCFormPage = lazy(()=>import('./pages/KYCFormPage/KYCFormPage'));
const App = () => {
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10 text-xl font-bold text-indigo-700">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/api/login" element={<LoginPage />} />
          <Route path="/api/signup" element={<SignUp />} />
          <Route path="/api/terms" element={<TermsAndConditions />} />
          <Route path="/api/forgot-password" element={<CheckAnswer />} />
          <Route path="/api/changepassword" element={<ChangePassword />} />
          <Route path="/api/ShowUsers" element={<ShowUsersData/>}/>
          <Route path="/api/kycform" element={<KYCFormPage/>}/>
          {/* Protected Routes */}
          <Route
            path="/api/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="api/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api/accounts"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <Accounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api/transactions"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api/profile"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Redirect all unknown paths to login */}
          <Route path="*" element={<Navigate to="/api/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

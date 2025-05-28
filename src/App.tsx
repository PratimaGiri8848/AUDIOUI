import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useTheme } from './hooks/useTheme';
import Dashboard from './components/dashboard/Dashboard';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './components/profile/Profile';
import { useAuthStore } from './lib/store';

function App() {
  const { theme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className={theme}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/signin"
            element={
              isAuthenticated ? <Navigate to="/dashboard?tab=general\" replace /> : <SignIn />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard?tab=general\" replace /> : <SignUp />
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? <Navigate to="/dashboard?tab=general\" replace /> : <ForgotPassword />
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Layout /> : <Navigate to="/signin\" replace />
            }
          >
            <Route index element={<Navigate to="/dashboard?tab=general\" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
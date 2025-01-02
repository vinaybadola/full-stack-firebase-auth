import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import EmailVerification from './components/auth/EmailVerification';
import Dashboard from './components/auth/Dashboard';
import ResendVerificationEmail from './components/auth/ResendVerification';
import Layout from './components/layout/Layout'; 

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout> 
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/resend-verification" element={<ResendVerificationEmail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
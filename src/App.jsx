import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { STORAGE_KEYS } from './utils/constants';
import './App.css';

function ProtectedRoute({ children }) {
  const username = localStorage.getItem(STORAGE_KEYS.username);
  if (!username) return <Navigate to="/" replace />;
  return children;
}

function LoginRoute({ children }) {
  const username = localStorage.getItem(STORAGE_KEYS.username);
  if (username) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      let device = 'desktop';
      if (width < 768) {
        device = 'mobile';
      } else if (width < 1024) {
        device = 'tablet';
      } else {
        device = 'laptop';
      }
      document.documentElement.setAttribute('data-device', device);
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <LoginRoute>
                <LoginPage />
              </LoginRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

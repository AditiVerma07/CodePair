import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoomPage from './pages/RoomPage';

/**
 * Gatekeeper higher-order routing wrapper component.
 * Deflects users instantly back to login views if no backend memory access token exists.
 */
function ProtectedGuard({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

/**
 * Reverse Gatekeeper wrapper component.
 * Deflects logged-in users away from auth gates straight back to workspace hubs.
 */
function PublicOnlyGuard({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public Authentication Gateways */}
        <Route path="/login" element={
          <PublicOnlyGuard>
            <Login />
          </PublicOnlyGuard>
        } />
        
        <Route path="/signup" element={
          <PublicOnlyGuard>
            <Signup />
          </PublicOnlyGuard>
        } />

        {/* Private Real-Time Engineering Workspaces */}
        <Route path="/dashboard" element={
          <ProtectedGuard>
            <Home />
          </ProtectedGuard>
        } />
        
        <Route path="/room/:roomId" element={
          <ProtectedGuard>
            <RoomPage />
          </ProtectedGuard>
        } />

        {/* Catch-all Wildcard Re-route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageCycles from './pages/ManageCycles';
import PublicCycleView from './pages/PublicCycleView';

function AppContent() {
  const location = useLocation();
  const isPublicView = location.pathname.startsWith('/cycle/');

  return (
    <div className="min-h-screen bg-slate-50">
      {!isPublicView && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/manage" element={<ProtectedRoute><ManageCycles /></ProtectedRoute>} />
        <Route path="/cycle/:uuid" element={<PublicCycleView />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

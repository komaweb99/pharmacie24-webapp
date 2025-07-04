import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Pharmacies from './pages/Pharmacies';
import ProtectedRoute from './components/ProtectedRoute';
import NetworkStatus from './components/NetworkStatus';
import './firebase';

// Lazy load heavy dashboard components
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PharmacistDashboard = React.lazy(() => import('./pages/PharmacistDashboard'));

// Loading fallback for lazy components
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Chargement du dashboard..." />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
              <NetworkStatus />
              <Navbar />
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pharmacies" element={<Pharmacies />} />
                  <Route 
                    path="/admin-dashboard" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<DashboardLoading />}>
                          <AdminDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/pharmacist-dashboard" 
                    element={
                      <ProtectedRoute requirePharmacist>
                        <Suspense fallback={<DashboardLoading />}>
                          <PharmacistDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </ErrorBoundary>
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
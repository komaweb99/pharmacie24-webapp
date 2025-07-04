import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cross, Menu, X, LogOut, Settings, Shield } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Cross className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">Pharmacies de Garde</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Accueil
            </Link>
            <Link to="/pharmacies" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Pharmacies
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Contact
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {userType === 'admin' && (
                  <Link 
                    to="/admin-dashboard" 
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                {userType === 'pharmacist' && (
                  <Link 
                    to="/pharmacist-dashboard" 
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Accueil
              </Link>
              <Link to="/pharmacies" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Pharmacies
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Contact
              </Link>
              
              {currentUser ? (
                <>
                  {userType === 'admin' && (
                    <Link to="/admin-dashboard" className="text-blue-600 hover:text-blue-700">
                      Admin Dashboard
                    </Link>
                  )}
                  {userType === 'pharmacist' && (
                    <Link to="/pharmacist-dashboard" className="text-emerald-600 hover:text-emerald-700">
                      Mon Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 text-left"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-emerald-600 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/register" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
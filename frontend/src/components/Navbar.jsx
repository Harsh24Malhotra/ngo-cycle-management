import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-wide">
            <Bike className="h-6 w-6" />
            <span>NariCycle Empower</span>
          </Link>
          {token && (
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-emerald-100 font-medium px-2 py-1">Dashboard</Link>
              <Link to="/manage" className="hover:text-emerald-100 font-medium px-2 py-1">Manage Cycles</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 px-3 py-2 rounded-lg font-medium transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

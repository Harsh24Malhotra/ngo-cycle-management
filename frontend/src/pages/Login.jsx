import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // PURE FRONTEND BYPASS - NO BACKEND REQUESTS AT ALL
    if (formData.email === 'admin@ngo.com' && formData.password === 'admin123') {
      localStorage.setItem('token', 'mocked-live-bypass-token');
      navigate('/dashboard');
    } else {
      setError('Please use the exact key: admin@ngo.com and admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">NariCycle Admin Login</h2>
        <div className="text-xs text-center text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          🔑 <strong>Master Key:</strong> admin@ngo.com | <strong>Password:</strong> admin123
        </div>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleLogin} className="mt-4 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Admin Email address" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Sign In</button>
        </form>
      </div>
    </div>
  );
}

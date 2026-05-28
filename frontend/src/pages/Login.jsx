import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bike, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-3">
            <Bike className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Control Gateway</h2>
          <p className="text-slate-500 text-sm mt-1">Authorized NGO administrative access only</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-sm mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none"
                placeholder="Enter username" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none"
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold tracking-wide transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

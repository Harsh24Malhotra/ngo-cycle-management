import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    name: '',
    frameNumber: '',
    status: 'Available',
    beneficiaryName: '',
    beneficiaryPhone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // 1. Create the cycle entry on the live Render backend
      const res = await axios.post('https://naricycle-backend.onrender.com/api/cycles', {
        name: formData.name,
        frameNumber: formData.frameNumber,
        status: formData.status
      });

      // 2. If registration requires immediate assignment
      if (formData.status === 'Assigned') {
        await axios.put(`https://naricycle-backend.onrender.com/api/cycles/${res.data._id}/assign`, {
          name: formData.beneficiaryName,
          phone: formData.beneficiaryPhone
        });
      }

      setSuccess("✨ Cycle registered successfully into live inventory cloud!");
      setFormData({ name: '', frameNumber: '', status: 'Available', beneficiaryName: '', beneficiaryPhone: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing cycle server request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Top Navigation Bar Component */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 2. Top Stats Section Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Fleet" value="--" icon="🚲" color="bg-blue-500" />
          <StatsCard title="Assigned Cycles" value="--" icon="🤝" color="bg-green-500" />
          <StatsCard title="In Maintenance" value="--" icon="🛠️" color="bg-amber-500" />
        </div>

        {/* 3. Core Interactive Form Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Register New Cycle Asset</h2>
              <p className="text-sm text-gray-500">Log fresh bicycle distribution inventory data directly into live cloud arrays.</p>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
            {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100">{success}</div>}

            <form onSubmit={handleCreateCycle} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Cycle Brand / Model</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Hero Jet, Avon" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Chassis / Frame ID Number</label>
                  <input type="text" name="frameNumber" value={formData.frameNumber} onChange={handleChange} required placeholder="e.g., NC-99234X" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Initial Operational Deployment Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-700">
                  <option value="Available">🟢 Available for Allocation</option>
                  <option value="Assigned">🤝 Assign Instantly to Beneficiary</option>
                  <option value="Maintenance">🛠️ Grounded / Under Maintenance</option>
                </select>
              </div>

              {formData.status === 'Assigned' && (
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4 animate-fadeIn">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">👤 Beneficiary Allocation Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-emerald-800 mb-1">Full Name</label>
                      <input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} required placeholder="Recipient's name" className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-emerald-800 mb-1">Contact / Phone Number</label>
                      <input type="text" name="beneficiaryPhone" value={formData.beneficiaryPhone} onChange={handleChange} required placeholder="10-digit mobile line" className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all transform active:scale-[0.98] text-sm mt-2">
                🚀 Commit Cycle Asset to Live Database
              </button>
            </form>
          </div>

          {/* Quick Informational Tips Sidebar card panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit space-y-4">
            <h3 className="font-bold text-gray-900 text-base">NGO Cloud Infrastructure Logs</h3>
            <div className="text-xs text-gray-600 space-y-3">
              <p className="p-2 bg-gray-50 rounded-lg">🟢 <strong>Status Check:</strong> Connected directly to live Render node environments cluster.</p>
              <p className="p-2 bg-gray-50 rounded-lg">📦 <strong>Data Sync:</strong> Operations instantly update globally verified inventory views.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

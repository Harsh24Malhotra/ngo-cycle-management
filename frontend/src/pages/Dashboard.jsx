import React, { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    name: '',
    frameNumber: '',
    status: 'Available',
    beneficiaryName: '',
    beneficiaryPhone: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      // 1. Create the cycle entry using the live Render cloud server
      const res = await axios.post('https://naricycle-backend.onrender.com/api/cycles', {
        name: formData.name,
        frameNumber: formData.frameNumber,
        status: formData.status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. If registration requires immediate assignment
      if (formData.status === 'Assigned') {
        await axios.put(`https://naricycle-backend.onrender.com/api/cycles/${res.data._id}/assign`, {
          name: formData.beneficiaryName,
          phone: formData.beneficiaryPhone
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert("Cycle registered successfully!");
      setFormData({ name: '', frameNumber: '', status: 'Available', beneficiaryName: '', beneficiaryPhone: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing cycle request');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-gray-900">Register New Cycle</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleCreateCycle} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cycle Brand / Model Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Frame Number</label>
          <input type="text" name="frameNumber" value={formData.frameNumber} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md">
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        {formData.status === 'Assigned' && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Beneficiary Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Beneficiary Name</label>
              <input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="beneficiaryPhone" value={formData.beneficiaryPhone} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md" />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Register Cycle</button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageCycles() {
  const [cycles, setCycles] = useState([]);
  const [error, setError] = useState('');

  const fetchCycles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://naricycle-backend.onrender.com/api/cycles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCycles(res.data);
    } catch (err) {
      setError('Could not retrieve cycle inventory database entries.');
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this cycle records profile entry?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://naricycle-backend.onrender.com/api/cycles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCycles();
    } catch (err) {
      alert("Error deleting record framework profiling data item.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage NGO Cycle Inventory</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frame ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cycles.map((cycle) => (
              <tr key={cycle._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cycle.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.frameNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${cycle.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{cycle.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleDelete(cycle._id)} className="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

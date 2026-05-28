import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PublicCycleView() {
  const [cycles, setCycles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await axios.get('https://naricycle-backend.onrender.com/api/cycles/public');
        setCycles(res.data);
      } catch (err) {
        console.error("Error communicating with tracking servers:", err);
      }
    };
    fetchPublicData();
  }, []);

  const filteredCycles = cycles.filter(c => 
    c.frameNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">NariCycle Verification Portal</h1>
          <p className="text-gray-600">Public transparency panel verification engine</p>
        </div>

        <input type="text" placeholder="Search by frame number or bicycle brand..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <div className="grid gap-4 md:grid-cols-2">
          {filteredCycles.map((cycle) => (
            <div key={cycle._id} className="p-4 bg-white rounded-xl shadow space-y-2 border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">{cycle.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cycle.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{cycle.status}</span>
              </div>
              <p className="text-sm text-gray-500">ID Verification Frame Reference: <span className="font-mono font-bold text-gray-700">{cycle.frameNumber}</span></p>
            </div>
          ))}
          {filteredCycles.length === 0 && (
            <p className="text-center text-gray-500 col-span-2 py-4">No tracking entries match your query parameters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

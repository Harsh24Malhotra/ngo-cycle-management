import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, QrCode, UserPlus, CornerUpLeft, Trash2, Edit } from 'lucide-react';
import QrModal from '../components/QrModal';

export default function ManageCycles() {
  const [cycles, setCycles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const [actionCycle, setActionCycle] = useState(null);
  const [actionType, setActionType] = useState(''); 

  const [bName, setBName] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bVillage, setBVillage] = useState('');
  const [bDate, setBDate] = useState(new Date().toISOString().split('T')[0]);

  const [uCondition, setUCondition] = useState('Good');
  const [uStatus, setUStatus] = useState('Available');

  const fetchCycles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://naricycle-backend.onrender.com/api/cycles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCycles(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCycles(); }, []);

  const handleReturn = async (id) => {
    if (!window.confirm("Verify physical custody check complete. Proceed marking returned?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://naricycle-backend.onrender.com/api/cycles/${id}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCycles();
    } catch (err) { console.error(err); }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://naricycle-backend.onrender.com/api/cycles/${actionCycle._id}/assign`, 
        { name: bName, phone: bPhone, village: bVillage, assignedDate: bDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetActions();
      fetchCycles();
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://naricycle-backend.onrender.com/api/cycles/${actionCycle._id}/update`, 
        { condition: uCondition, status: uStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetActions();
      fetchCycles();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("CRITICAL WARNING: Completely wipe this configuration and history permanently?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://naricycle-backend.onrender.com/api/cycles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCycles();
    } catch (err) { console.error(err); }
  };

  const resetActions = () => {
    setActionCycle(null);
    setActionType('');
    setBName(''); setBPhone(''); setBVillage('');
  };

  const filteredCycles = cycles.filter(c => {
    const matchesSearch = c.cycleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.currentBeneficiary?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.currentBeneficiary?.phone?.includes(searchTerm);
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Asset Ledger Tracking</h1>
          <p className="text-slate-500 text-sm">Review, reassign, or update cycle allocation state metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name, Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none w-56 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none bg-transparent">
              <option value="All">All Allocations</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Repair">Under Repair</option>
            </select>
          </div>
        </div>
      </div>

      {actionType === 'assign' && (
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Assign Cycle Asset: <span className="text-emerald-600">{actionCycle.cycleId}</span></h3>
          <form onSubmit={handleAssignSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Beneficiary Name</label>
              <input type="text" value={bName} onChange={(e) => setBName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contact Number</label>
              <input type="text" value={bPhone} onChange={(e) => setBPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Village Location</label>
              <input type="text" value={bVillage} onChange={(e) => setBVillage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Date Allocated</label>
              <input type="date" value={bDate} onChange={(e) => setBDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" required />
            </div>
            <div className="md:col-span-4 flex justify-end space-x-2 mt-2">
              <button type="button" onClick={resetActions} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm">Save Allocation Profile</button>
            </div>
          </form>
        </div>
      )}

      {actionType === 'edit_condition' && (
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Update Asset Status: <span className="text-blue-600">{actionCycle.cycleId}</span></h3>
          <form onSubmit={handleUpdateStatusSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Physical Structural Status</label>
              <select value={uCondition} onChange={(e) => setUCondition(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500">
                <option value="Good">Good</option>
                <option value="Damaged">Damaged</option>
                <option value="Needs Service">Needs Service</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Availability Status</label>
              <select value={uStatus} onChange={(e) => setUStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500">
                <option value="Available">Available</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Assigned" disabled>Assigned (Requires Allocation Processing)</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
              <button type="button" onClick={resetActions} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm">Apply Modifications</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <th className="py-4 px-6">Cycle ID</th>
                <th className="py-4 px-6">Status State</th>
                <th className="py-4 px-6">Condition</th>
                <th className="py-4 px-6">Beneficiary Particulars</th>
                <th className="py-4 px-6 text-center">Operations Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCycles.map((cycle) => (
                <tr key={cycle._id} className="hover:bg-slate-50/40 transition">
                  <td className="py-4 px-6 font-bold text-slate-800">{cycle.cycleId}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      cycle.status === 'Assigned' ? 'bg-emerald-50 text-emerald-700' :
                      cycle.status === 'Available' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {cycle.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">{cycle.condition}</td>
                  <td className="py-4 px-6">
                    {cycle.status === 'Assigned' ? (
                      <div>
                        <p className="font-semibold text-slate-800">{cycle.currentBeneficiary.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{cycle.currentBeneficiary.village} • {cycle.currentBeneficiary.phone}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">No Deployment Record</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button 
                        onClick={() => { setSelectedCycle(cycle); setShowQrModal(true); }}
                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition" 
                        title="Display Asset QR Blueprint"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => { setActionCycle(cycle); setActionType('edit_condition'); setUCondition(cycle.condition); setUStatus(cycle.status); }}
                        className="p-2 hover:bg-slate-100 text-blue-600 rounded-lg transition"
                        title="Modify State Settings"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {cycle.status !== 'Assigned' ? (
                        <button 
                          onClick={() => { setActionCycle(cycle); setActionType('assign'); }}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition"
                          title="Assign Beneficiary"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleReturn(cycle._id)}
                      className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition"
                      title="Process Return Intake"
                    >
                      <CornerUpLeft className="h-4 w-4" />
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(cycle._id)}
                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                    title="Purge Record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredCycles.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-10 text-slate-400 italic">No cycles match the filtering criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {showQrModal && <QrModal cycle={selectedCycle} onClose={() => { setShowQrModal(false); setSelectedCycle(null); }} />}
</div>
);
}

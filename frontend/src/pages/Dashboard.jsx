import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bike, CheckCircle, AlertCircle, RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [cycleId, setCycleId] = useState('');
  const [condition, setCondition] = useState('Good');
  const [status, setStatus] = useState('Available');
  
  // New state tracking fields for direct assignment during registration
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
  const [beneficiaryVillage, setBeneficiaryVillage] = useState('');

  const fetchCycles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://naricycle-backend.onrender.com/api/cycles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCycles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCycles(); }, []);

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    // Construct the payload based on selected status
    const initialPayload = {
      cycleId,
      condition,
      status
    };

    // If status is Assigned, append the holder profile data directly
    if (status === 'Assigned') {
      initialPayload.name = beneficiaryName;
      initialPayload.phone = beneficiaryPhone;
      initialPayload.village = beneficiaryVillage || 'Main Center';
      initialPayload.assignedDate = new Date().toISOString().split('T')[0];
    }

    try {
      const token = localStorage.getItem('token');
      
      // 1. Create the asset unit configuration
      const res = await axios.post('https://naricycle-backend.onrender.com/api/cycles/create', 
        { cycleId, condition, status: status === 'Assigned' ? 'Available' : status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. If registration requires immediate assignment, route details to allocation endpoint
      if (status === 'Assigned') {
        await axios.put(`https://naricycle-backend.onrender.com/api/cycles/${res.data._id}/assign`,
          { name: beneficiaryName, phone: beneficiaryPhone, village: beneficiaryVillage || 'Main Center', assignedDate: new Date().toISOString().split('T')[0] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Clear configuration parameters
      setCycleId('');
      setBeneficiaryName('');
      setBeneficiaryPhone('');
      setBeneficiaryVillage('');
      fetchCycles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing asset registration');
    } finally {
      setFormLoading(false);
    }
  };

  const total = cycles.length;
  const assigned = cycles.filter(c => c.status === 'Assigned').length;
  const available = cycles.filter(c => c.status === 'Available').length;
  const repair = cycles.filter(c => c.status === 'Under Repair').length;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Operational Overview</h1>
        <p className="text-slate-500 text-sm">Realtime updates on cycle distribution metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Inventory" value={total} icon={Bike} colorClass="bg-blue-50 text-blue-600" />
        <StatsCard title="Assigned Fleet" value={assigned} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Available Fleet" value={available} icon={RefreshCw} colorClass="bg-indigo-50 text-indigo-700" />
        <StatsCard title="In Maintenance" value={repair} icon={AlertCircle} colorClass="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-lg mb-4 border-b border-slate-100 pb-3">
            <PlusCircle className="h-5 w-5 text-emerald-600" />
            <h2>Register New Asset</h2>
          </div>

          {error && <div className="mb-4 text-xs bg-rose-50 text-rose-600 p-3 rounded-lg font-medium">{error}</div>}

          <form onSubmit={handleCreateCycle} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Asset Cycle ID</label>
              <input 
                type="text" 
                value={cycleId} 
                onChange={(e) => setCycleId(e.target.value)}
                placeholder="e.g., CYCLE-104"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Status State</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition"
              >
                <option value="Available">Available (In Storage)</option>
                <option value="Assigned">Assigned (Issue directly to person)</option>
                <option value="Under Repair">Under Repair</option>
              </select>
            </div>

            {status === 'Assigned' && (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3 animate-fadeIn">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Beneficiary Profile Info</p>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={beneficiaryName} 
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" 
                    required={status === 'Assigned'}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={beneficiaryPhone} 
                    onChange={(e) => setBeneficiaryPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" 
                    required={status === 'Assigned'}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Village Location</label>
                  <input 
                    type="text" 
                    value={beneficiaryVillage} 
                    onChange={(e) => setBeneficiaryVillage(e.target.value)}
                    placeholder="Enter village name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Physical Condition</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition"
              >
                <option value="Good">Good Condition</option>
                <option value="Damaged">Damaged Asset</option>
                <option value="Needs Service">Needs Service</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={formLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold tracking-wide py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {formLoading ? 'Processing Profile Registration...' : 'Commit Asset Unit'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Latest Operations Logs</h2>
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {cycles.map((c) => (
              <div key={c._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-700">{c.cycleId}</p>
                  <p className="text-xs text-slate-400 mt-0.5">UUID Reference: {c.uuid.substring(0,8)}...</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                    c.status === 'Assigned' ? 'bg-emerald-50 text-emerald-700' :
                    c.status === 'Available' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {c.status}
                  </span>
                  <p className="text-xs font-medium text-slate-500 mt-1">{c.currentBeneficiary?.name ? `${c.currentBeneficiary.name} (${c.currentBeneficiary.phone})` : 'Unassigned Fleet'}</p>
                </div>
              </div>
            ))}
            {cycles.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No inventory tracking entries present.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

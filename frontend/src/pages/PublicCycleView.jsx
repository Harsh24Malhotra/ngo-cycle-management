import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, PhoneCall, Building2, HelpCircle, Loader2, AlertTriangle, User, Smartphone } from 'lucide-react';

export default function PublicCycleView() {
  const { uuid } = useParams();
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await axios.get(`https://naricycle-backend.onrender.com/api/cycles/public/${uuid}`);
        setCycle(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-2" />
        <p className="text-sm font-semibold text-slate-500">Retrieving Verification Data...</p>
      </div>
    );
  }

  if (error || !cycle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Invalid Verification Source</h2>
          <p className="text-sm text-slate-500 mt-2">The scanned barcode structural route does not map to any registered asset registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-md overflow-hidden border border-slate-100">
        
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-3 backdrop-blur-sm">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">NariCycle Empower</h1>
          <p className="text-emerald-100/90 text-xs font-medium tracking-wider uppercase mt-0.5">Women Mobile Autonomy Support Network</p>
          
          <div className="absolute right-4 top-4 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center space-x-1 border border-white/10">
            <ShieldCheck className="h-3 w-3" />
            <span>NGO VERIFIED</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permanent Cycle ID</p>
              <p className="text-lg font-extrabold text-slate-800 mt-0.5">{cycle.cycleId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-extrabold rounded-full ${
                cycle.status === 'Assigned' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                cycle.status === 'Available' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {cycle.status === 'Assigned' ? 'Active Circulation' : cycle.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Authorized Recipient</h3>
            {cycle.status === 'Assigned' && cycle.currentBeneficiary?.name ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Assigned To</p>
                    <p className="text-base font-bold text-slate-800">{cycle.currentBeneficiary.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2 border-t border-slate-200/60">
                  <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Registered Mobile Contact</p>
                    <p className="text-sm font-bold text-slate-700">{cycle.currentBeneficiary.phone}</p>
                  </div>
                </div>
                
                {cycle.currentBeneficiary.village && (
                  <p className="text-xs font-semibold text-slate-400 pl-11">Region: {cycle.currentBeneficiary.village}</p>
                )}
              </div>
            ) : (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center text-sm font-semibold text-amber-800">
                This asset inventory unit is at the NGO repository center. Ready for allocation processing.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-bold uppercase mb-0.5">
                <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                <span>NGO Helpline</span>
              </div>
              <p className="text-sm font-extrabold text-slate-700">+1800-419-5678</p>
            </div>
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-bold uppercase mb-0.5">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verification Authority</span>
              </div>
              <p className="text-xs font-bold text-slate-600 mt-0.5">NariCycle Trust HQ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

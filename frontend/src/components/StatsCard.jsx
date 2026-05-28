import React from 'react';

export default function StatsCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

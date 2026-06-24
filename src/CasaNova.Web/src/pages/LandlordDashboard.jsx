import React from 'react';
import { Link } from 'react-router-dom';

export default function LandlordDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A365D]">Landlord Portal</h1>
          <p className="text-sm text-slate-400">Overview of listed properties and analytical reports.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert('Downloading Excel sheet...')} className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm">
            Export Report
          </button>
          <Link to="/dashboard/landlord/create" className="bg-[#1A365D] hover:bg-[#11243F] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md">
            + Add Property
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Listed Units', value: '3' },
          { label: 'Occupancy Rate', value: '84%' },
          { label: 'Net Revenue', value: '$3.5M COP' },
          { label: 'Pending Bookings', value: '1' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
            <p className="text-xl md:text-2xl font-black text-[#1A365D] mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
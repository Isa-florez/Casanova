import React from 'react';
import { Link } from 'react-router-dom';

export default function TenantDashboard() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h3 className="font-bold text-[#B78420]">Verification Required</h3>
          <p className="text-sm text-amber-700 font-light">Please upload your ID to clear automated KYC criteria before check-in.</p>
        </div>
        <Link to="/dashboard/kyc" className="bg-[#D69E2E] hover:bg-[#B78420] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0">
          Verify Now
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-[#1A365D]">My Bookings</h2>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 flex justify-between items-center shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 uppercase tracking-wider">Confirmed</span>
          <h4 className="font-bold text-[#1A365D] mt-2 text-lg">Modern Apartment Laureles</h4>
          <p className="text-slate-400 text-xs mt-1">June 25 - June 28, 2026</p>
        </div>
        <button onClick={() => alert('Cancellation request dispatched.')} className="text-sm font-medium text-red-500 hover:underline">Cancel Stay</button>
      </div>
    </div>
  );
}
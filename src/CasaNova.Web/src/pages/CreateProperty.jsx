import React from 'react';

export default function CreateProperty() {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
      <h2 className="text-2xl font-bold text-[#1A365D] mb-6">List New Property</h2>
      <form onSubmit={e => { e.preventDefault(); alert('Property saved to backend payload context!'); }} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
          <input type="text" required placeholder="Luxury Penthouse" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-[#1A365D] focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price per Night</label>
            <input type="number" required placeholder="200000" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-[#1A365D] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
            <input type="text" required placeholder="Medellín" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-[#1A365D] focus:outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full bg-[#1A365D] text-white py-3 rounded-xl font-bold hover:bg-[#11243F] shadow-md transition-all">
          Deploy Listing
        </button>
      </form>
    </div>
  );
}
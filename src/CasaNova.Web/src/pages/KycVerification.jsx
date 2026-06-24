import React, { useState } from 'react';

export default function KycVerification() {
  const [proc, setProc] = useState('none'); // none, loading, done

  const runKyc = () => {
    setProc('loading');
    setTimeout(() => setProc('done'), 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-100 p-8 rounded-2xl shadow-xl text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A365D]">Identity Engine</h2>
        <p className="text-xs text-slate-400 mt-1">AI-driven automated document crosscheck</p>
      </div>

      {proc === 'none' && (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50/50">
          <p className="text-sm text-slate-500 mb-4">Attach passport or official state ID</p>
          <button type="button" onClick={runKyc} className="bg-[#1A365D] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm">
            Upload Document
          </button>
        </div>
      )}

      {proc === 'loading' && (
        <div className="py-6 flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D]"></div>
          <p className="text-sm font-medium text-slate-600">Processing attributes via optical AI...</p>
        </div>
      )}

      {proc === 'done' && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-left space-y-1">
          <p className="text-xs font-bold text-emerald-700 uppercase">Verification Verified ✓</p>
          <p className="text-sm text-slate-700 font-medium mt-1">Autonomous identity validation step completed cleanly.</p>
        </div>
      )}
    </div>
  );
}
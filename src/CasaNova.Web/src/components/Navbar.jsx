import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/properties" className="text-2xl font-bold text-[#1A365D]">
        Casa<span className="text-[#D69E2E]">Nova</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/properties" className="text-slate-600 hover:text-[#1A365D] font-medium transition-colors">Properties</Link>
        {user ? (
          <>
            {user.role === 'Tenant' && <Link to="/dashboard/tenant" className="text-slate-600 hover:text-[#1A365D] font-medium">My Bookings</Link>}
            {user.role === 'Landlord' && <Link to="/dashboard/landlord" className="text-slate-600 hover:text-[#1A365D] font-medium">Landlord Portal</Link>}
            <button onClick={() => { logout(); navigate('/properties'); }} className="text-red-500 font-medium hover:underline transition-all">Log Out</button>
            <div className="w-10 h-10 rounded-xl bg-[#1A365D] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <Link to="/auth" className="bg-[#1A365D] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#11243F] transition-all shadow-md">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
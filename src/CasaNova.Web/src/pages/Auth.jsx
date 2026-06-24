import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Tenant');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ id: Date.now(), name: email.split('@')[0], role }, navigate);
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
      <div className="flex justify-center border-b border-slate-100 pb-4 mb-6 gap-6">
        <button type="button" onClick={() => setIsLogin(true)} className={`text-lg font-bold pb-2 ${isLogin ? 'text-[#1A365D] border-b-2 border-[#1A365D]' : 'text-slate-400'}`}>Sign In</button>
        <button type="button" onClick={() => setIsLogin(false)} className={`text-lg font-bold pb-2 ${!isLogin ? 'text-[#1A365D] border-b-2 border-[#1A365D]' : 'text-slate-400'}`}>Register</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
          <input type="email" required onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1A365D]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Password</label>
          <input type="password" required placeholder="••••••••" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1A365D]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">I am a:</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#1A365D]">
            <option value="Tenant">Guest (Huésped)</option>
            <option value="Landlord">Host (Propietario)</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-[#1A365D] hover:bg-[#11243F] text-white py-3.5 rounded-xl font-bold transition-colors shadow-md pt-4">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user, setDeferredAction } = useAuth();
  const navigate = useNavigate();

  const prop = { id, title: 'Modern Apartment Laureles', price: 150000, description: 'Premium temporary stay equipped with high-speed internet and prime location amenities.' };

  const handleBooking = () => {
    if (!user) {
      setDeferredAction({ redirectTo: `/properties/${id}`, callback: () => alert('Booking pipeline linked successfully!') });
      navigate('/auth');
    } else {
      navigate('/dashboard/tenant');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-80 bg-slate-100 rounded-3xl flex items-center justify-center text-7xl shadow-inner">🏢</div>
        <h1 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">{prop.title}</h1>
        <p className="text-slate-600 leading-relaxed">{prop.description}</p>
        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-1">
          <h4 className="font-bold text-[#B78420] text-sm">Rules & Policy:</h4>
          <p className="text-xs text-slate-500"> Check-in: 2:00 PM | Check-out: 12:00 PM</p>
        </div>
      </div>
      <div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase">Price per night</p>
            <p className="text-3xl font-black text-[#1A365D]">${prop.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">COP</span></p>
          </div>
          <button onClick={handleBooking} className="w-full bg-[#D69E2E] hover:bg-[#B78420] text-white py-3.5 rounded-xl font-bold transition-all shadow-md">
            Book Stay Now
          </button>
        </div>
      </div>
    </div>
  );
}
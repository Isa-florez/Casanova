import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const MOCK_PROPERTIES = [
  { id: 1, title: 'Modern Apartment Laureles', city: 'Medellín', price: 150000, type: 'Apartment', rating: 4.9, image: '🏢' },
  { id: 2, title: 'El Poblado Luxury House', city: 'Medellín', price: 280000, type: 'House', rating: 4.8, image: '🏡' },
  { id: 3, title: 'Panoramic View Loft', city: 'Bogotá', price: 200000, type: 'Loft', rating: 4.7, image: '🏙️' },
];

export default function Marketplace() {
  const [filter, setFilter] = useState('All');
  const { wishlist, toggleWishlist, user, setDeferredAction } = useAuth();
  const navigate = useNavigate();

  const handleFav = (e, id) => {
    e.stopPropagation();
    if (!user) {
      setDeferredAction({ redirectTo: '/properties', callback: () => toggleWishlist(id) });
      navigate('/auth');
    } else {
      toggleWishlist(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2A4D7C] rounded-3xl p-8 md:p-12 text-center text-white shadow-lg">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">Find your next stay</h1>
        <p className="text-slate-200 mb-6 font-light">Short-term premium rentals</p>
        <div className="bg-white p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-md">
          <input type="text" placeholder="Where to?" className="flex-1 px-4 py-3 text-slate-800 focus:outline-none placeholder-slate-400" />
          <button className="bg-[#D69E2E] hover:bg-[#B78420] text-white px-8 py-3 rounded-xl font-bold transition-colors">Search</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Apartment', 'House', 'Loft'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-xl font-semibold border transition-all shrink-0 ${
              filter === type ? 'bg-[#1A365D] text-white border-[#1A365D]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROPERTIES.filter(p => filter === 'All' || p.type === filter).map((prop) => (
          <div
            key={prop.id}
            onClick={() => navigate(`/properties/${prop.id}`)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all cursor-pointer relative group"
          >
            <button onClick={(e) => handleFav(e, prop.id)} className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 shadow-sm hover:bg-white">
              {wishlist.includes(prop.id) ? '❤️' : '🤍'}
            </button>
            <div className="h-48 bg-slate-50 flex items-center justify-center text-5xl group-hover:scale-102 transition-transform duration-300">
              {prop.image}
            </div>
            <div className="p-5 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#1A365D] line-clamp-1">{prop.title}</h3>
                <span className="text-sm font-bold text-[#D69E2E]">★ {prop.rating}</span>
              </div>
              <p className="text-slate-400 text-sm"> {prop.city}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <p className="text-slate-600 text-sm"><span className="text-lg font-black text-[#1A365D]">${prop.price.toLocaleString()}</span> / night</p>
                <span className="text-sm font-bold text-[#1A365D] group-hover:text-[#D69E2E] transition-colors">Details &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
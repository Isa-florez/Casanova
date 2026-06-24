import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import PropertyDetail from './pages/PropertyDetail';
import Auth from './pages/Auth';
import TenantDashboard from './pages/TenantDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import CreateProperty from './pages/CreateProperty';
import KycVerification from './pages/KycVerification';
import Navbar from './components/Navbar';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id: 1, name: 'Alice', role: 'Tenant' }
  const [wishlist, setWishlist] = useState([]);
  const [deferredAction, setDeferredAction] = useState(null);

  const login = (userData, navigate) => {
    setUser(userData);
    if (deferredAction) {
      const { redirectTo, callback } = deferredAction;
      setDeferredAction(null);
      if (callback) callback();
      navigate(redirectTo);
    } else {
      navigate(userData.role === 'Landlord' ? '/dashboard/landlord' : '/dashboard/tenant');
    }
  };

  const logout = () => setUser(null);

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, wishlist, toggleWishlist, deferredAction, setDeferredAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F7FAFC] text-slate-800 font-sans antialiased">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/properties" element={<Marketplace />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard/tenant" element={<TenantDashboard />} />
              <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
              <Route path="/dashboard/landlord/create" element={<CreateProperty />} />
              <Route path="/dashboard/kyc" element={<KycVerification />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
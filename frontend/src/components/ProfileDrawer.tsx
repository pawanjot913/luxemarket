import React from 'react';
import { X, Award, ShieldAlert, MapPin, Package, RefreshCw, CheckCircle, Shield } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLogout: () => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  userProfile,
  onLogout,
}: ProfileDrawerProps) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const displayName = userProfile.name?.trim() || 'Guest';
  const displayEmail = userProfile.email?.trim() || 'No email linked';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const points = userProfile.points ?? 0;
  const nextTierPoints = userProfile.nextTierPoints ?? 1000;
  const tier = userProfile.tier ?? 'Gold';
  const orders = userProfile.orders ?? [];
  const pointsProgressPercent = Math.min(100, (points / nextTierPoints) * 100);

  return (
    <AnimatePresence>
      <div id="profile-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        {/* Click outside to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          id="profile-drawer-container"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 id="profile-drawer-title" className="text-sm font-bold tracking-widest uppercase text-black">
              Account & Loyalty Status
            </h2>
            <button
              id="close-profile-btn"
              onClick={onClose}
              className="text-neutral-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Profile Details Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* User Basics */}
            <div id="profile-user-info" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold tracking-wider">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-black">{displayName}</h3>
                  {userProfile.role === 'admin' && (
                    <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-wider flex items-center gap-0.5">
                      <Shield size={8} /> Admin
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-400">{displayEmail}</span>
              </div>
            </div>

            {/* Loyalty Card display */}
            <div id="loyalty-badge-card" className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight mt-0.5">{tier} Tier</h4>
                </div>
                <Award size={24} className="text-[#2F58CD]" />
              </div>

              {/* Progress bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[10px] text-neutral-400 font-semibold tracking-wider">
                  <span>Points Balance: <strong className="text-white font-black">{points}</strong></span>
                  <span>{nextTierPoints} Points target</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2F58CD] transition-all duration-500 rounded-full"
                    style={{ width: `${pointsProgressPercent}%` }}
                  />
                </div>
              </div>

              <span className="text-[9px] text-neutral-400 leading-snug block">
                Exclusive privileges unlocked: Complimentary worldwide standard shipping, 10% points acceleration, and priority preview on future pre-orders.
              </span>
            </div>

            {/* Delivery address */}
            <div id="saved-address-section" className="space-y-2">
              <span className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400">Default Shipping Address</span>
              <div className="p-4 bg-neutral-50 rounded-sm border border-neutral-200 flex gap-3">
                <MapPin size={16} className="text-[#2F58CD] shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {userProfile.savedAddress}
                </p>
              </div>
            </div>

            {/* Order History */}
            <div id="order-history-section" className="space-y-4">
              <span className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400">Recent Purchase History</span>
              {orders.length === 0 ? (
                <div className="text-center py-6 bg-neutral-50 border border-neutral-100 rounded-sm">
                  <Package size={20} className="mx-auto text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-400">No previous orders tracked.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      id={`order-row-${order.id}`}
                      key={order.id}
                      className="p-4 border border-neutral-200 hover:border-black rounded-sm transition-colors flex justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-neutral-100 rounded-sm overflow-hidden shrink-0">
                          <img
                            src={order.image}
                            alt={order.id}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black">{order.id}</span>
                            <span className="text-[10px] text-neutral-400">{order.date}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">
                            {order.itemsCount} {order.itemsCount === 1 ? 'Style item' : 'Style items'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-black block">${order.total.toFixed(2)}</span>
                        <div className="flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-emerald-600 justify-end mt-1">
                          <CheckCircle size={10} />
                          <span>{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-3">
            {userProfile.role === 'admin' && (
              <button
                id="profile-admin-panel-btn"
                onClick={() => {
                  onClose();
                  navigate('/admin');
                }}
                className="w-full bg-[#2F58CD] hover:bg-blue-700 text-white py-2.5 text-xs font-extrabold tracking-widest uppercase rounded-sm text-center transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Shield size={14} />
                <span>Access Admin Console</span>
              </button>
            )}
            <button
              id="profile-signout-btn"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-sm text-center transition-colors cursor-pointer"
            >
              Sign Out of Account
            </button>
            <button
              id="profile-close-btn"
              onClick={onClose}
              className="w-full border border-neutral-300 hover:border-black text-black py-2.5 text-xs font-semibold tracking-widest uppercase rounded-sm text-center transition-colors cursor-pointer"
            >
              Close Panel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

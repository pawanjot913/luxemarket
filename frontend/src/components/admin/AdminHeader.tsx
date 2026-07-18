import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, Globe, Bell, Heart } from 'lucide-react';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adminUser: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lowStockCount: number;
  pendingCount: number;
}

export default function AdminHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  adminUser,
  searchQuery,
  setSearchQuery,
  lowStockCount,
  pendingCount
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalAlerts = (lowStockCount > 0 ? 1 : 0) + (pendingCount > 0 ? 1 : 0);

  return (
    <header className="h-[70px] bg-white border-b border-[#E9ECEF] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Hamburger menu button for mobile screens */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-1 hover:bg-neutral-100 rounded-sm lg:hidden text-neutral-600 hover:text-black cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="relative w-full max-w-[150px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 text-neutral-600 pl-10 pr-4 py-2 rounded-full text-xs font-medium border border-neutral-200 focus:outline-hidden focus:bg-white transition-all uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Right Header items */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        {/* Locale Language Dropdown */}
        <div className="hidden md:flex items-center gap-2 text-neutral-500 hover:text-black transition-colors cursor-pointer">
          <Globe size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">English (US)</span>
        </div>

        {/* Icons */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="text-neutral-500 hover:text-black transition-colors relative cursor-pointer p-1"
          >
            <Bell size={16} />
            {totalAlerts > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Popover Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E9ECEF] rounded-sm shadow-xl py-2 z-50 text-left font-sans">
              <div className="px-4 py-2.5 border-b border-[#E9ECEF] flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-black">Notifications</span>
                <span className="text-[8px] font-extrabold uppercase bg-red-50 text-red-500 px-1.5 py-0.5 rounded-xs">
                  {totalAlerts} Alert{totalAlerts !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#F1F3F5] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {lowStockCount > 0 && (
                  <div className="p-4 hover:bg-neutral-50 transition-colors">
                    <span className="text-red-500 font-black block text-[9px] mb-0.5">Restock Warning</span>
                    <span className="text-neutral-800 font-semibold block leading-relaxed normal-case">
                      {lowStockCount} items in your catalog have dropped below the safe stock threshold.
                    </span>
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="p-4 hover:bg-neutral-50 transition-colors">
                    <span className="text-amber-600 font-black block text-[9px] mb-0.5">Fulfillment Queue</span>
                    <span className="text-neutral-800 font-semibold block leading-relaxed normal-case">
                      You have {pendingCount} customer orders pending shipment and dispatch.
                    </span>
                  </div>
                )}
                <div className="p-4 hover:bg-neutral-50 transition-colors">
                  <span className="text-[#2F58CD] font-black block text-[9px] mb-0.5">System Status</span>
                  <span className="text-neutral-800 font-semibold block leading-relaxed normal-case">
                    Database records and analytical graphs successfully synchronized.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="hidden sm:block text-neutral-500 hover:text-black transition-colors cursor-pointer">
          <Heart size={16} />
        </button>

        {/* Profile circular avatar icon */}
        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            alt={adminUser?.name || 'Admin Profile'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

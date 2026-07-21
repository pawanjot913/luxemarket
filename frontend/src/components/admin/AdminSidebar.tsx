import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
  X,
  ExternalLink,
  Tag
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'inventory' | 'orders' | 'analytics' | 'settings' | 'discounts';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'orders' | 'analytics' | 'settings' | 'discounts') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  adminUser: any;
  onViewStorefront: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  adminUser,
  onViewStorefront
}: AdminSidebarProps) {
  return (
    <>
      {/* Overlay Backdrop for Mobile Screens when Sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR PANEL */}
      <aside
        className={`w-[260px] bg-white border-r border-[#E9ECEF] flex flex-col justify-between p-6 h-screen transition-transform duration-300 z-40 fixed left-0 top-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Admin Header Title */}
          <div className="text-left flex justify-between items-center">
            <div>
              <h1 className="text-lg font-black text-black tracking-tight uppercase flex items-center gap-1.5">
                Admin Console
              </h1>
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest block mt-0.5">
                LuxeMarket Operations
              </span>
            </div>
            {/* Close button inside sidebar on mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-neutral-400 hover:text-black"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation vertical list */}
          <nav className="flex flex-col gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventory', label: 'Inventory', icon: Boxes },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              ...((adminUser?.role === 'admin' || adminUser?.role === 'seller') ? [
                { id: 'discounts', label: 'Discounts', icon: Tag }
              ] : []),
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Admin footer info card */}
        <div className="pt-6 border-t border-[#E9ECEF] space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center text-white shrink-0 border border-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                alt={adminUser?.name || 'Admin Profile'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black uppercase">
                {adminUser?.name || adminUser?.username || 'Alex Mercer'}
              </h4>
              <span className="text-[9px] text-[#2F58CD] font-black uppercase tracking-widest block mt-0.5">
                {adminUser?.email || 'Global Admin'}
              </span>
            </div>
          </div>

          <button
            onClick={onViewStorefront}
            className="w-full bg-[#1C1C1C] hover:bg-black text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-sm flex items-center justify-center gap-2 border border-neutral-800 transition-colors cursor-pointer"
          >
            <ExternalLink size={12} />
            <span>View Storefront</span>
          </button>
        </div>
      </aside>
    </>
  );
}

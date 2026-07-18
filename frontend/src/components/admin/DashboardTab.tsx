import React from 'react';
import { Plus, MoreVertical, RefreshCw } from 'lucide-react';
import { Product } from '../../types';

interface DashboardTabProps {
  adminUser: any;
  dashboardStats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
  averageOrderValue: number;
  displayOrders: any[];
  monthlyRevenue: any[];
  productsList: Product[];
  isLoadingDashboard: boolean;
  onExportReport: () => void;
  onCreateProductClick: () => void;
  onViewAllOrdersClick: () => void;
}

export default function DashboardTab({
  adminUser,
  dashboardStats,
  averageOrderValue,
  displayOrders,
  monthlyRevenue,
  productsList,
  isLoadingDashboard,
  onExportReport,
  onCreateProductClick,
  onViewAllOrdersClick
}: DashboardTabProps) {
  return (
    <div className="space-y-8 text-left">
      {/* executive summary header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">Executive Summary</h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Welcome back, {adminUser?.name || 'Alex'}. Here's what's happening with LuxeMarket today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onExportReport}
            className="bg-white border border-[#CED4DA] hover:border-black text-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer shrink-0"
          >
            Export Report
          </button>
          <button
            onClick={onCreateProductClick}
            className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer shrink-0"
          >
            Create New
          </button>
        </div>
      </div>

      {isLoadingDashboard ? (
        <div className="text-center py-20 bg-white border border-[#E9ECEF] rounded-md">
          <RefreshCw className="animate-spin text-neutral-400 mx-auto mb-2" size={24} />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
            Synchronizing dashboard analytics...
          </span>
        </div>
      ) : (
        <>
          {/* 4 columns summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Revenue',
                value: `$${(dashboardStats?.totalRevenue ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`,
                change: 'Live',
                isPositive: true
              },
              {
                title: 'Active Orders',
                value: (dashboardStats?.totalOrders ?? 0).toLocaleString(),
                change: 'Live',
                isPositive: true
              },
              {
                title: 'Pending Orders',
                value: (dashboardStats?.pendingOrders ?? 0).toLocaleString(),
                change: 'Queue',
                isPositive: 'neutral'
              },
              {
                title: 'Avg. Order Value',
                value: `$${(averageOrderValue ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`,
                change: 'Live',
                isPositive: true
              }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-md shadow-xs border border-[#E9ECEF] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm tracking-wider ${
                      stat.isPositive === true
                        ? 'bg-[#2F58CD]/10 text-[#2F58CD]'
                        : stat.isPositive === false
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-black mt-4">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Grid content split: Recent Orders and Sales Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left table view: Recent orders */}
            <div className="lg:col-span-2 bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-black">Recent Orders</h3>
                <button
                  onClick={onViewAllOrdersClick}
                  className="text-[#2F58CD] hover:text-blue-700 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#F1F3F5] text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F5]">
                    {displayOrders.map((row, i) => (
                      <tr key={row.id || i} className="align-middle">
                        <td className="py-4 font-bold text-black">{row.id}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-[9px] text-neutral-500 uppercase tracking-wider shrink-0 border border-neutral-200">
                              {row.initials}
                            </div>
                            <span className="font-semibold text-neutral-700">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm ${row.class}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-black">{row.amt}</td>
                        <td className="py-4 text-right">
                          <button className="text-neutral-400 hover:text-black cursor-pointer">
                            <MoreVertical size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right chart growth sidebar */}
            <div className="bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">Sales Growth</h3>
                  <select className="border border-neutral-200 text-[10px] font-bold uppercase tracking-wider bg-transparent py-1 px-2 rounded-sm text-neutral-600 focus:outline-hidden">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>

                {/* Simple aesthetic CSS bar chart */}
                <div className="h-44 flex items-end justify-between gap-2.5 pb-2 border-b border-[#F1F3F5] mb-6">
                  {(() => {
                    const defaultBars = [
                      { label: 'Jan', val: 0, h: '25%' },
                      { label: 'Feb', val: 0, h: '45%' },
                      { label: 'Mar', val: 0, h: '75%' },
                      { label: 'Apr', val: 0, h: '55%' },
                      { label: 'May', val: 0, h: '65%' },
                      { label: 'Jun', val: 0, h: '40%' },
                      { label: 'Jul', val: 0, h: '50%' }
                    ];

                    if (!monthlyRevenue || monthlyRevenue.length === 0) {
                      return defaultBars.map((bar, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 space-y-2">
                          <div className="relative w-full">
                            <div className="w-full bg-neutral-100 rounded-xs transition-all duration-700" style={{ height: bar.h }} />
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                            {bar.label}
                          </span>
                        </div>
                      ));
                    }

                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue || 0), 1);

                    return monthlyRevenue.slice(-7).map((item, i, arr) => {
                      const label = monthNames[(item.month - 1) % 12] || `${item.month}`;
                      const revenueVal = item.revenue || 0;
                      const heightPct = Math.max(10, Math.round((revenueVal / maxRevenue) * 100));
                      const isLatest = i === arr.length - 1;

                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center flex-1 space-y-2"
                          title={`$${revenueVal.toFixed(2)} (${item.orders} orders)`}
                        >
                          <div className="relative w-full">
                            {isLatest && (
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm shrink-0">
                                Latest
                              </span>
                            )}
                            <div
                              className={`w-full rounded-xs transition-all duration-700 ${
                                isLatest ? 'bg-black' : 'bg-neutral-100 hover:bg-neutral-200'
                              }`}
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                            {label}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Metric progress bars */}
                <div className="space-y-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span>Order Completion</span>
                      <span className="text-black font-extrabold">
                        {dashboardStats.totalOrders > 0
                          ? ((dashboardStats.deliveredOrders / dashboardStats.totalOrders) * 100).toFixed(1)
                          : '0.0'}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full"
                        style={{
                          width: `${
                            dashboardStats.totalOrders > 0
                              ? (dashboardStats.deliveredOrders / dashboardStats.totalOrders) * 100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span>In-Stock Catalog</span>
                      <span className="text-black font-extrabold">
                        {productsList.length > 0
                          ? ((productsList.filter((p) => (p.stock || 0) > 0).length / productsList.length) * 100).toFixed(1)
                          : '0.0'}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full"
                        style={{
                          width: `${
                            productsList.length > 0
                              ? (productsList.filter((p) => (p.stock || 0) > 0).length / productsList.length) * 100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Plus button inside Sales growth card corner */}
              <button
                onClick={onCreateProductClick}
                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-black text-white hover:bg-neutral-800 shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

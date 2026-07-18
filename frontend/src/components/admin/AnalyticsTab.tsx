import React from 'react';
import { Product } from '../../types';

interface AnalyticsTabProps {
  topCategories: any[];
  dashboardStats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
  lowStockProducts: Product[];
  productsList: Product[];
  topProducts: any[];
  topCustomers: any[];
}

export default function AnalyticsTab({
  topCategories,
  dashboardStats,
  lowStockProducts,
  productsList,
  topProducts,
  topCustomers
}: AnalyticsTabProps) {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">Business Analytics</h2>
        <p className="text-xs text-neutral-500 mt-1 font-medium">
          Real-time database records monitoring sales velocity, gross margins, and user retention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Units Sold',
            val: `${topCategories.reduce((sum, item) => sum + (item.totalSold || 0), 0).toLocaleString()} units`,
            percent: '100%',
            color: 'bg-black'
          },
          {
            label: 'Order Fulfillment Rate',
            val: `${dashboardStats.totalOrders > 0
              ? ((dashboardStats.deliveredOrders / dashboardStats.totalOrders) * 100).toFixed(1)
              : '0.0'}%`,
            percent: `${dashboardStats.totalOrders > 0
              ? (dashboardStats.deliveredOrders / dashboardStats.totalOrders) * 100
              : 0}%`,
            color: 'bg-[#2F58CD]'
          },
          {
            label: 'Restock Warning Rate',
            val: `${lowStockProducts.length} items low`,
            percent: `${productsList.length > 0
              ? Math.min(100, (lowStockProducts.length / productsList.length) * 100)
              : 0}%`,
            color: 'bg-emerald-500'
          }
        ].map((ana, i) => (
          <div key={i} className="bg-white p-6 rounded-md border border-[#E9ECEF] space-y-4">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              {ana.label}
            </span>
            <h3 className="text-xl font-black text-black tracking-tight">{ana.val}</h3>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className={`h-full ${ana.color} rounded-full`} style={{ width: ana.percent }} />
            </div>
          </div>
        ))}
      </div>

      {/* Data Analytics Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Selling Products */}
        <div className="bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F1F3F5] text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3 text-right">Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5] font-semibold text-neutral-700">
                {topProducts.length > 0 ? (
                  topProducts.map((p, i) => (
                    <tr key={i}>
                      <td className="py-3 text-black font-bold">{p.name || 'Unknown Product'}</td>
                      <td className="py-3 text-right text-emerald-600 font-extrabold">{p.totalSold} units</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-neutral-400 text-xs">No sales data recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Low Stock Inventory Alerts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F1F3F5] text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3 text-right">Remaining Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5] font-semibold text-neutral-700">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((p, i) => (
                    <tr key={i}>
                      <td className="py-3 text-black font-bold">{p.name}</td>
                      <td className="py-3">${(p.price || 0).toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-sm font-extrabold text-[10px] ${p.stock && p.stock <= 2 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {p.stock ?? 0} units
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-neutral-400 text-xs">All inventory stock levels are healthy.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="lg:col-span-2 bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Top Spending Customers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F1F3F5] text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3">
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3 text-center">Total Orders</th>
                  <th className="pb-3 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5] font-semibold text-neutral-700">
                {topCustomers.length > 0 ? (
                  topCustomers.map((c, i) => (
                    <tr key={i} className="align-middle">
                      <td className="py-3 text-black font-bold">{c.name || 'Anonymous User'}</td>
                      <td className="py-3 text-neutral-500 font-medium">{c.email}</td>
                      <td className="py-3 text-center font-extrabold text-black">{c.orders}</td>
                      <td className="py-3 text-right text-[#2F58CD] font-black">${(c.totalSpent || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-neutral-400 text-xs">No active customer analytics logs.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

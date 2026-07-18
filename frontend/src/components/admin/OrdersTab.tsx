import React from 'react';

interface OrdersTabProps {
  adminOrdersList: any[];
  handleUpdateStatus: (orderId: string, nextStatus: string) => void;
}

export default function OrdersTab({
  adminOrdersList,
  handleUpdateStatus
}: OrdersTabProps) {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">Customer Orders</h2>
        <p className="text-xs text-neutral-500 mt-1 font-medium">
          Complete logs of processing, dispatched, and delivered luxury styles.
        </p>
      </div>

      <div className="bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F1F3F5] text-[10px] font-bold text-neutral-400 uppercase tracking-widest pb-3">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Payment status</th>
                <th className="pb-3">Fulfillment</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5] font-semibold text-neutral-700">
              {(adminOrdersList.length > 0 ? adminOrdersList : [
                { id: '#LX-8291', name: 'Julianne Smith', date: '2026-07-16', pay: 'Authorized', fill: 'Processing', color: 'text-amber-500', amt: '$1,290.00' },
                { id: '#LX-8290', name: 'Marcus Knight', date: '2026-07-15', pay: 'Authorized', fill: 'Pending Approval', color: 'text-neutral-500', amt: '$450.50' },
                { id: '#LX-8289', name: 'Elena Lopez', date: '2026-07-15', pay: 'Paid', fill: 'Shipped', color: 'text-[#2F58CD]', amt: '$3,820.00' },
                { id: '#LX-8288', name: 'Henry Wright', date: '2026-07-14', pay: 'Paid', fill: 'Delivered', color: 'text-emerald-500', amt: '$920.00' },
                { id: '#LX-8287', name: 'Sasha Grey', date: '2026-07-12', pay: 'Paid', fill: 'Delivered', color: 'text-emerald-500', amt: '$1,500.00' },
              ]).map((row: any, i) => {
                const orderId = row.id || row._id || '#LX-8000';
                const customerName = row.user?.name || row.user?.username || row.name || 'Guest Customer';
                const orderDate = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : (row.date || 'N/A');
                const paymentStatus = row.paymentStatus || row.pay || 'Pending';
                const fulfillmentStatus = row.status || row.fill || 'Processing';
                const totalAmount = row.totalAmount || row.total || 0;
                const amtStr = typeof totalAmount === 'number' ? `$${totalAmount.toFixed(2)}` : (row.amt || '$0.00');

                let fillClass = 'text-neutral-500';
                if (fulfillmentStatus === 'delivered') fillClass = 'text-emerald-500';
                else if (fulfillmentStatus === 'shipped') fillClass = 'text-[#2F58CD]';
                else if (fulfillmentStatus === 'cancelled') fillClass = 'text-red-500';
                else if (fulfillmentStatus === 'pending' || fulfillmentStatus === 'Processing') fillClass = 'text-amber-500';
                else if (row.color) fillClass = row.color;

                return (
                  <tr key={orderId || i} className="align-middle">
                    <td className="py-4 font-bold text-black">{orderId}</td>
                    <td className="py-4 text-black">{customerName}</td>
                    <td className="py-4 font-medium text-neutral-400">{orderDate}</td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${paymentStatus === 'paid' || paymentStatus === 'Paid' || paymentStatus === 'Authorized' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{paymentStatus}</span>
                      </span>
                    </td>
                    <td className={`py-4 font-bold ${fillClass}`}>{fulfillmentStatus}</td>
                    <td className="py-4 font-bold text-black">{amtStr}</td>
                    <td className="py-4 text-right">
                      {fulfillmentStatus.toLowerCase() === 'pending' || fulfillmentStatus === 'Processing' || fulfillmentStatus === 'Pending Approval' ? (
                        <button
                          onClick={() => handleUpdateStatus(orderId, 'shipped')}
                          className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xs text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Ship Order
                        </button>
                      ) : fulfillmentStatus.toLowerCase() === 'shipped' ? (
                        <button
                          onClick={() => handleUpdateStatus(orderId, 'delivered')}
                          className="bg-[#2F58CD] hover:bg-blue-700 text-white px-3 py-1.5 rounded-xs text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Deliver Order
                        </button>
                      ) : (
                        <span className="text-neutral-400 text-[9px] font-extrabold uppercase tracking-wider">
                          No Actions
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

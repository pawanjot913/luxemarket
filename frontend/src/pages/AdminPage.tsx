import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Product } from '../types';
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  fetchAdminDashboardStats,
  fetchAdminOrders,
  fetchAdminAOV,
  fetchAdminTopProducts,
  fetchAdminMonthlyRevenue,
  fetchAdminOrderStatus,
  fetchAdminTopCustomers,
  fetchAdminLowStock,
  fetchAdminTopCategories,
  fetchUserProfile,
  updateOrderStatus,
  fetchAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  toggleAdminCouponStatus
} from '../api';

// Import modular sub-components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardTab from '../components/admin/DashboardTab';
import InventoryTab from '../components/admin/InventoryTab';
import OrdersTab from '../components/admin/OrdersTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import ProductModal from '../components/admin/ProductModal';
import DiscountsTab from '../components/admin/DiscountsTab';

interface AdminPageProps {
  authToken: string | null;
  triggerNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function AdminPage({ authToken, triggerNotification }: AdminPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'analytics' | 'settings' | 'discounts'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dashboard API Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);

  // Inventory & database loading states
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [adminOrdersList, setAdminOrdersList] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [couponsList, setCouponsList] = useState<any[]>([]);

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAllData = async (isCancelledRef = { current: false }) => {
    if (!authToken) return;
    try {
      setIsLoadingInventory(true);
      setIsLoadingDashboard(true);
      setIsLoadingCoupons(true);

      const promises = [
        fetchProducts(1, 100)
          .then(data => {
            if (!isCancelledRef.current) setProductsList(data);
          })
          .catch(err => console.error('Failed to load inventory', err)),

        fetchAdminOrders(authToken)
          .then(data => {
            const list = data?.orders || [];
            if (!isCancelledRef.current) setAdminOrdersList(list);
          })
          .catch(err => console.error('Failed to load orders list', err)),

        fetchAdminDashboardStats(authToken)
          .then(stats => {
            const dashboardObj = stats?.dashboard || stats;
            if (!isCancelledRef.current && dashboardObj) setDashboardStats(dashboardObj);
          })
          .catch(err => console.error('Failed to load dashboard statistics', err)),

        fetchAdminAOV(authToken)
          .then(aovRes => {
            const val = aovRes?.analytics?.averageOrderValue ?? aovRes?.averageOrderValue;
            if (!isCancelledRef.current && typeof val === 'number') setAverageOrderValue(val);
          })
          .catch(err => console.error('Failed to load average order value stats', err)),

        fetchAdminMonthlyRevenue(authToken)
          .then(rev => {
            const list = rev?.monthlyRevenue || [];
            if (!isCancelledRef.current && Array.isArray(list)) setMonthlyRevenue(list);
          })
          .catch(err => console.error('Failed to load monthly revenue stats', err)),

        fetchAdminTopCustomers(authToken)
          .then(cust => {
            const list = cust?.topCustomers || [];
            if (!isCancelledRef.current && Array.isArray(list)) setTopCustomers(list);
          })
          .catch(err => console.error('Failed to load top customers', err)),

        fetchAdminTopProducts(authToken)
          .then(prod => {
            const list = prod?.topSellingProducts || [];
            if (!isCancelledRef.current && Array.isArray(list)) setTopProducts(list);
          })
          .catch(err => console.error('Failed to load top products', err)),

        fetchAdminLowStock(authToken)
          .then(low => {
            const list = low?.lowStockProducts || [];
            if (!isCancelledRef.current && Array.isArray(list)) setLowStockProducts(list);
          })
          .catch(err => console.error('Failed to load low stock warning alert lists', err)),

        fetchAdminTopCategories(authToken)
          .then(cat => {
            const list = cat?.topCategories || [];
            if (!isCancelledRef.current && Array.isArray(list)) setTopCategories(list);
          })
          .catch(err => console.error('Failed to load top categories', err)),

        fetchUserProfile(authToken)
          .then(user => {
            if (!isCancelledRef.current && user) setAdminUser(user);
          })
          .catch(err => console.error('Failed to retrieve logged admin metadata profile', err)),

        fetchAdminCoupons(authToken)
          .then(data => {
            const list = data?.coupons || [];
            if (!isCancelledRef.current) setCouponsList(list);
          })
          .catch(err => console.error('Failed to load coupons', err))
      ];

      await Promise.allSettled(promises);
    } finally {
      if (!isCancelledRef.current) {
        setIsLoadingInventory(false);
        setIsLoadingDashboard(false);
        setIsLoadingCoupons(false);
      }
    }
  };

  const loadInventory = () => {
    const isCancelledRef = { current: false };
    loadAllData(isCancelledRef);
  };

  useEffect(() => {
    const isCancelledRef = { current: false };
    loadAllData(isCancelledRef);

    return () => {
      isCancelledRef.current = true;
    };
  }, [authToken]);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    if (!authToken) {
      triggerNotification('Access token is missing.', 'info');
      return;
    }
    try {
      await updateOrderStatus(orderId, nextStatus, authToken);
      triggerNotification(`Order status updated to ${nextStatus}.`);
      loadInventory();
    } catch (err) {
      triggerNotification(err instanceof Error ? err.message : 'Update status failed.', 'info');
    }
  };

  const handleDelete = async (id: string) => {
    if (!authToken) {
      triggerNotification('Auth token is missing.', 'info');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id, authToken);
      triggerNotification('Product deleted from database.');
      loadInventory();
    } catch (err) {
      triggerNotification(err instanceof Error ? err.message : 'Deletion failed.', 'info');
    }
  };

  const handleExportReport = () => {
    const orders = adminOrdersList.length > 0 ? adminOrdersList : [];
    if (orders.length === 0) {
      triggerNotification('No order data available to export.', 'info');
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Order Date',
      'Payment Status',
      'Fulfillment Status',
      'Total Amount',
      'Payment Method'
    ];

    const rows = orders.map(order => {
      const orderId = order.id || order._id || 'N/A';
      const name = order.user?.name || order.user?.username || order.name || 'Guest';
      const email = order.user?.email || 'N/A';
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.date || 'N/A');
      const payStatus = order.paymentStatus || order.pay || 'Pending';
      const fillStatus = order.status || order.fill || 'Processing';
      const amount = order.totalAmount || order.total || 0;
      const method = order.paymentMethod || 'N/A';

      return [
        `"${orderId}"`,
        `"${name.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${date}"`,
        `"${payStatus}"`,
        `"${fillStatus}"`,
        amount.toFixed(2),
        `"${method}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LuxeMarket_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification('Sales report exported successfully.');
  };

  const handleModalSave = async (payload: any) => {
    if (!authToken) {
      triggerNotification('Access token is required.', 'info');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload, authToken);
        triggerNotification('Product specifications updated.');
      } else {
        await createProduct(payload, authToken);
        triggerNotification('Product created successfully.');
      }
      setIsModalOpen(false);
      loadInventory();
    } catch (err) {
      triggerNotification(err instanceof Error ? err.message : 'Save failed.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCouponStatus = async (couponId: string) => {
    if (!authToken) return;
    try {
      await toggleAdminCouponStatus(couponId, authToken);
      triggerNotification('Coupon status toggled.');
      loadInventory();
    } catch (err) {
      triggerNotification(err instanceof Error ? err.message : 'Toggle status failed.', 'info');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!authToken) return;
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteAdminCoupon(couponId, authToken);
      triggerNotification('Coupon deleted successfully.');
      loadInventory();
    } catch (err) {
      triggerNotification(err instanceof Error ? err.message : 'Delete coupon failed.', 'info');
    }
  };

  const handleSaveCoupon = async (couponId: string | null, payload: any) => {
    if (!authToken) return;
    try {
      if (couponId) {
        await updateAdminCoupon(couponId, payload, authToken);
        triggerNotification('Coupon updated successfully.');
      } else {
        await createAdminCoupon(payload, authToken);
        triggerNotification('Coupon registered successfully.');
      }
      loadInventory();
    } catch (err) {
      triggerNotification(err instanceof Error ? err.message : 'Save coupon failed.', 'info');
      throw err;
    }
  };

  const defaultDashboardOrders = [
    { id: '#LX-8291', initials: 'JS', name: 'Julianne Smith', status: 'Paid', class: 'bg-[#2F58CD]/15 text-[#2F58CD]', amt: '$1,290.00' },
    { id: '#LX-8290', initials: 'MK', name: 'Marcus Knight', status: 'Pending', class: 'bg-neutral-100 text-neutral-600', amt: '$450.50' },
    { id: '#LX-8289', initials: 'EL', name: 'Elena Lopez', status: 'Shipped', class: 'bg-black text-white font-medium', amt: '$3,820.00' },
    { id: '#LX-8288', initials: 'HW', name: 'Henry Wright', status: 'Paid', class: 'bg-[#2F58CD]/15 text-[#2F58CD]', amt: '$920.00' },
  ];

  const displayOrders = adminOrdersList.length > 0
    ? adminOrdersList.slice(0, 4).map((order: any) => {
        const initials = order.user?.name
          ? order.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          : 'G';
        const isPaid = order.paymentStatus === 'paid';
        let statusClass = 'bg-neutral-100 text-neutral-600';
        if (order.status === 'delivered') statusClass = 'bg-emerald-50 text-emerald-600';
        else if (order.status === 'shipped') statusClass = 'bg-black text-white font-medium';
        else if (isPaid) statusClass = 'bg-[#2F58CD]/15 text-[#2F58CD]';

        return {
          id: order.id || order._id || '#LX-8000',
          initials,
          name: order.user?.name || 'Guest Customer',
          status: order.status || 'Pending',
          class: statusClass,
          amt: `$${(order.totalAmount || order.total || 0).toFixed(2)}`
        };
      })
    : defaultDashboardOrders;

  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = adminOrdersList.filter(order => {
    const orderId = (order.id || order._id || '').toLowerCase();
    const custName = (order.user?.name || order.user?.username || order.name || '').toLowerCase();
    const custEmail = (order.user?.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return orderId.includes(query) || custName.includes(query) || custEmail.includes(query);
  });

  const filteredDisplayOrders = displayOrders.filter(order => {
    const orderId = (order.id || '').toLowerCase();
    const name = (order.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return orderId.includes(query) || name.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1D20] font-sans antialiased relative">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        adminUser={adminUser}
        onViewStorefront={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MAIN CONTENT AREA */}
      <div className="min-h-screen flex flex-col lg:pl-[260px]">
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          adminUser={adminUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          lowStockCount={lowStockProducts.length}
          pendingCount={dashboardStats.pendingOrders}
        />

        {/* PAGE CONTENT ROUTER */}
        <main className="p-8 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardTab
              adminUser={adminUser}
              dashboardStats={dashboardStats}
              averageOrderValue={averageOrderValue}
              displayOrders={filteredDisplayOrders}
              monthlyRevenue={monthlyRevenue}
              productsList={productsList}
              isLoadingDashboard={isLoadingDashboard}
              onExportReport={handleExportReport}
              onCreateProductClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              onViewAllOrdersClick={() => setActiveTab('orders')}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              productsList={filteredProducts}
              isLoadingInventory={isLoadingInventory}
              onCreateProductClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              onEditProductClick={(product) => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
              onDeleteProductClick={handleDelete}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              adminOrdersList={filteredOrders}
              handleUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'discounts' && (adminUser?.role === 'admin' || adminUser?.role === 'seller') && (
            <DiscountsTab
              coupons={couponsList}
              isLoading={isLoadingCoupons}
              onToggleStatus={handleToggleCouponStatus}
              onDelete={handleDeleteCoupon}
              onSave={handleSaveCoupon}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              topCategories={topCategories}
              dashboardStats={dashboardStats}
              lowStockProducts={lowStockProducts}
              productsList={productsList}
              topProducts={topProducts}
              topCustomers={topCustomers}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 text-left max-w-xl">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-black">Admin Configuration</h2>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  Configure active currency mappings, server metrics details, and layout controls.
                </p>
              </div>

              <div className="bg-white rounded-md border border-[#E9ECEF] p-6 shadow-xs space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    Administrative Scope
                  </label>
                  <input
                    type="text"
                    disabled
                    value="GLOBAL_CATALOG_MANAGEMENT_API"
                    className="w-full bg-neutral-50 border border-[#CED4DA] p-3 text-xs font-semibold rounded-sm text-neutral-400 select-none uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                    Assigned Role Credentials
                  </label>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0" />
                    <span>Authorized Signature: WRITE_PRODUCT_INTEGRATION_TOKEN_VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        onSave={handleModalSave}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

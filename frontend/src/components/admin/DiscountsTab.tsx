import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, Edit, Check, X } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
}

interface DiscountsTabProps {
  coupons: Coupon[];
  isLoading: boolean;
  onToggleStatus: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSave: (id: string | null, payload: any) => Promise<void>;
}

export default function DiscountsTab({
  coupons,
  isLoading,
  onToggleStatus,
  onDelete,
  onSave
}: DiscountsTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('0');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (editingCoupon) {
      setCode(editingCoupon.code);
      setDiscountType(editingCoupon.discountType);
      setDiscountValue(editingCoupon.discountValue.toString());
      setMinOrderAmount(editingCoupon.minOrderAmount.toString());
      setMaxDiscount(editingCoupon.maxDiscount?.toString() || '');
      setExpiryDate(editingCoupon.expiryDate ? new Date(editingCoupon.expiryDate).toISOString().split('T')[0] : '');
    } else {
      setCode('');
      setDiscountType('percentage');
      setDiscountValue('');
      setMinOrderAmount('0');
      setMaxDiscount('');
      setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days from now default
    }
  }, [editingCoupon, isFormOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue) || 0,
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
        expiryDate: new Date(expiryDate).toISOString()
      };
      await onSave(editingCoupon ? editingCoupon._id : null, payload);
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">Discount Codes</h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Manage storewide campaigns, adjust discount rates, and configure minimum order values.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsFormOpen(true);
          }}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-3 text-xs font-black uppercase tracking-widest rounded-sm transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus size={14} /> Add Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 bg-white border border-[#E9ECEF] rounded-md">
          <RefreshCw className="animate-spin text-neutral-400 mx-auto mb-2" size={24} />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
            Synchronizing database records...
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-[#E9ECEF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-[#E9ECEF] text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-6">Discount Details</th>
                  <th className="py-4 px-6">Min Order</th>
                  <th className="py-4 px-6">Max Discount</th>
                  <th className="py-4 px-6">Expiration Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-neutral-50/50 transition-colors font-semibold text-neutral-700">
                      <td className="py-4 px-6 font-bold text-black uppercase">
                        {coupon.code}
                      </td>
                      <td className="py-4 px-6">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% off`
                          : `$${coupon.discountValue.toFixed(2)} off`}
                      </td>
                      <td className="py-4 px-6">
                        ${coupon.minOrderAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {coupon.maxDiscount ? `$${coupon.maxDiscount.toFixed(2)}` : 'No Limit'}
                      </td>
                      <td className="py-4 px-6 font-medium text-neutral-400">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => onToggleStatus(coupon._id)}
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-sm tracking-wider cursor-pointer ${
                            coupon.isActive
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-red-55/10 text-red-500'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setIsFormOpen(true);
                            }}
                            className="p-2 border border-[#CED4DA] hover:border-black text-neutral-600 hover:text-black rounded-sm transition-colors cursor-pointer"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => onDelete(coupon._id)}
                            className="p-2 border border-red-200 hover:border-red-600 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-sm transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400 font-bold uppercase tracking-wider text-xs">
                      No active discount coupons found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl p-8 space-y-6 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                {editingCoupon ? 'Edit Coupon Configurations' : 'Register New Campaign Coupon'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              {/* Code */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. LUXE50"
                  className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Discount Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? 'e.g. 15' : 'e.g. 50'}
                    className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Min Order */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Min Order Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
                  />
                </div>

                {/* Max Discount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Max Discount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="e.g. 200 (Optional)"
                    className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 tracking-widest">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full border border-neutral-200 p-2.5 rounded-sm focus:outline-hidden text-neutral-800 focus:border-black bg-white"
                />
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-neutral-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-white border border-[#CED4DA] hover:border-black text-black py-3 rounded-sm font-black uppercase tracking-widest transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white py-3 rounded-sm font-black uppercase tracking-widest transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="animate-spin" size={12} />}
                  <span>{editingCoupon ? 'Save Changes' : 'Register Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

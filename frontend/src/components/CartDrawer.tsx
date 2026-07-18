import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Ticket, CheckCircle, CreditCard, ChevronLeft, ShoppingBag } from 'lucide-react';
import { CartItem, Color } from '../types';
import { PROMO_CODES } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onAddOrder: (total: number, itemsCount: number, image: string) => void;
}

type DrawerStep = 'bag' | 'shipping' | 'payment' | 'success';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddOrder
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<DrawerStep>('bag');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Shipping form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Payment form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>({});
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedDiscount !== null) {
    if (appliedDiscount < 1) {
      discountAmount = subtotal * appliedDiscount; // percentage
    } else {
      discountAmount = appliedDiscount; // flat
    }
  }

  const shippingCost = subtotal > 500 || subtotal === 0 ? 0 : 15.00;
  const estimatedTax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shippingCost + estimatedTax;

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.toUpperCase().trim();
    if (!code) return;

    if (PROMO_CODES[code] !== undefined) {
      setAppliedDiscount(PROMO_CODES[code]);
      setCouponSuccess(`Promo "${code}" applied successfully!`);
    } else {
      setCouponError('Invalid promotion code');
    }
  };

  const validateShippingForm = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required';
    if (!address.trim()) errors.address = 'Shipping address is required';
    if (!zipCode.trim() || zipCode.length < 5) errors.zipCode = 'Valid ZIP code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors: { [key: string]: string } = {};
    const sanitizedCard = cardNumber.replace(/\s+/g, '');
    if (sanitizedCard.length < 15 || sanitizedCard.length > 16) {
      errors.cardNumber = 'Enter valid credit card number';
    }
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      errors.cardExpiry = 'Expiry MM/YY required';
    }
    if (cardCvv.length < 3) {
      errors.cardCvv = 'CVV is required';
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePaymentForm()) {
      setIsProcessingOrder(true);
      setTimeout(() => {
        setIsProcessingOrder(false);
        const orderNo = `LM-${Math.floor(10000 + Math.random() * 90000)}`;
        setGeneratedOrderNumber(orderNo);
        setStep('success');
        
        // Add order to profile history
        onAddOrder(total, cartItems.reduce((acc, item) => acc + item.quantity, 0), cartItems[0]?.product.image || '');
        // Clear global cart
        onClearCart();
      }, 1500);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <AnimatePresence>
      <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        {/* Click outside to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          id="cart-drawer-container"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'bag' && step !== 'success' && (
                <button
                  id="checkout-back-btn"
                  onClick={() => setStep(step === 'payment' ? 'shipping' : 'bag')}
                  className="p-1 hover:bg-neutral-100 rounded-full text-neutral-600 hover:text-black cursor-pointer transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <h2 id="cart-drawer-title" className="text-md font-bold tracking-widest uppercase text-black">
                {step === 'bag' && `Shopping Bag (${cartItems.reduce((acc, i) => acc + i.quantity, 0)})`}
                {step === 'shipping' && 'Shipping Details'}
                {step === 'payment' && 'Secure Checkout'}
                {step === 'success' && 'Order Confirmed'}
              </h2>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="text-neutral-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Core Body Container based on Steps */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* STEP 1: SHOPPING BAG ITEMS LIST */}
            {step === 'bag' && (
              <>
                {cartItems.length === 0 ? (
                  <div id="empty-cart-view" className="h-full flex flex-col items-center justify-center text-center pb-12">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-1">Your bag is empty</h3>
                    <p className="text-xs text-neutral-400 max-w-[240px] leading-relaxed">
                      Discover new season arrivals and complete your minimalist silhouette.
                    </p>
                    <button
                      id="empty-cart-shop-all"
                      onClick={onClose}
                      className="mt-6 border border-black hover:bg-black hover:text-white text-black text-xs font-semibold tracking-widest uppercase py-2.5 px-6 transition-colors duration-200 cursor-pointer"
                    >
                      Shop New Collection
                    </button>
                  </div>
                ) : (
                  <div id="cart-items-list" className="space-y-6">
                    {cartItems.map((item) => (
                      <motion.div
                        id={`cart-item-row-${item.id}`}
                        key={item.id}
                        layout
                        className="flex gap-4 border-b border-neutral-100 pb-5"
                      >
                        {/* Image */}
                        <div className="w-20 h-24 bg-neutral-50 rounded-sm overflow-hidden shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-bold text-black leading-snug">{item.product.name}</h4>
                              <button
                                id={`remove-cart-item-${item.id}`}
                                onClick={() => onRemoveItem(item.id)}
                                className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block mt-0.5">
                              Size: {item.selectedSize} | {item.selectedColor.name}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            {/* Quantity Adjustment */}
                            <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-sm">
                              <button
                                id={`decrease-cart-item-qty-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-0.5 text-xs text-neutral-500 hover:text-black cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-black">{item.quantity}</span>
                              <button
                                id={`increase-cart-item-qty-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs text-neutral-500 hover:text-black cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-xs font-bold text-black">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING DETAILS FORM */}
            {step === 'shipping' && (
              <form id="shipping-form" onSubmit={handleNextToPayment} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Recipient Name</label>
                  <input
                    id="shipping-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                    placeholder="Full name"
                  />
                  {formErrors.fullName && <p className="text-red-500 text-[10px] mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Email Address</label>
                  <input
                    id="shipping-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                    placeholder="you@domain.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Delivery Address</label>
                  <input
                    id="shipping-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                    placeholder="Street, suite, floor"
                  />
                  {formErrors.address && <p className="text-red-500 text-[10px] mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Zip/Postal Code</label>
                  <input
                    id="shipping-zip"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                    placeholder="90069"
                    maxLength={10}
                  />
                  {formErrors.zipCode && <p className="text-red-500 text-[10px] mt-1">{formErrors.zipCode}</p>}
                </div>

                <div className="p-3 bg-neutral-50 rounded-sm border border-neutral-200 flex items-start gap-2.5 mt-6">
                  <ShieldCheck size={16} className="text-[#2F58CD] mt-0.5 shrink-0" />
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    By submitting this secure form you agree to LuxeMarket dispatch metrics. Shipping speeds vary from 2 to 4 luxury delivery cycles.
                  </p>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT DETAILS */}
            {step === 'payment' && (
              <form id="payment-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="bg-black text-white p-5 rounded-md mb-6 shadow-lg">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Secure Vault</span>
                      <h4 className="text-xs font-black tracking-tight uppercase">LuxeMarket Black</h4>
                    </div>
                    <CreditCard size={20} className="text-[#2F58CD]" />
                  </div>
                  <div className="mb-4">
                    <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Card Number</span>
                    <span className="font-mono text-sm tracking-widest">
                      {cardNumber ? cardNumber : '•••• •••• •••• ••••'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Holder</span>
                      <span className="text-xs uppercase font-medium">{fullName ? fullName : 'Cardholder'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Expiry</span>
                      <span className="font-mono text-xs">{cardExpiry ? cardExpiry : 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Cardholder Name</label>
                  <input
                    id="payment-holder"
                    type="text"
                    value={fullName}
                    disabled
                    className="w-full text-xs p-3 bg-neutral-100 border border-neutral-200 rounded-sm text-neutral-500 cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Card Number</label>
                  <input
                    id="payment-card-number"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                    placeholder="4000 1234 5678 9010"
                    maxLength={19}
                  />
                  {paymentErrors.cardNumber && <p className="text-red-500 text-[10px] mt-1">{paymentErrors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Expiry Date</label>
                    <input
                      id="payment-card-expiry"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {paymentErrors.cardExpiry && <p className="text-red-500 text-[10px] mt-1">{paymentErrors.cardExpiry}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Security CVV</label>
                    <input
                      id="payment-card-cvv"
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-black"
                      placeholder="•••"
                      maxLength={4}
                    />
                    {paymentErrors.cardCvv && <p className="text-red-500 text-[10px] mt-1">{paymentErrors.cardCvv}</p>}
                  </div>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION PANEL */}
            {step === 'success' && (
              <div id="checkout-success-view" className="h-full flex flex-col items-center justify-center text-center pb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600"
                >
                  <CheckCircle size={44} />
                </motion.div>
                <h3 className="text-md font-bold uppercase tracking-widest text-black mb-2">Precision Order Placed</h3>
                <span className="text-xs bg-neutral-100 text-neutral-800 font-semibold uppercase tracking-wider py-1 px-3.5 rounded-sm block mb-4">
                  Order #: {generatedOrderNumber}
                </span>
                <p className="text-xs text-neutral-500 max-w-[280px] leading-relaxed mb-6">
                  Thank you for shopping with LuxeMarket. Your payment has been securely settled and simulated dispatch metrics initiated. Check your profile account order history for status.
                </p>
                <div className="w-full border-t border-b border-neutral-100 py-4 mb-6 text-left">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-neutral-500">Shipped to</span>
                    <span className="font-semibold text-black">{fullName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Address</span>
                    <span className="font-semibold text-black truncate max-w-[180px]">{address}</span>
                  </div>
                </div>
                <button
                  id="checkout-success-done"
                  onClick={() => {
                    setStep('bag');
                    onClose();
                  }}
                  className="w-full bg-black hover:bg-[#2F58CD] text-white py-3 text-xs font-bold tracking-widest uppercase rounded-sm transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            )}

          </div>

          {/* Pricing Summary (Only shown in bag, shipping, and payment steps, and when items are in cart) */}
          {step !== 'success' && cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50">
              
              {/* Promo Code Input - Only in initial Bag View */}
              {step === 'bag' && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        id="coupon-input"
                        type="text"
                        placeholder="Coupon e.g. PRECISION10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:border-black uppercase"
                      />
                    </div>
                    <button
                      id="apply-coupon-btn"
                      onClick={handleApplyCoupon}
                      className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-[10px] mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-emerald-600 text-[10px] mt-1">{couponSuccess}</p>}
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Bag Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount !== null && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discounted</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Estimated Shipping</span>
                  <span>{shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>State Duties & Taxes</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200/60 pt-2 flex justify-between font-bold text-sm text-black">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Step Navigation Button */}
              {step === 'bag' && (
                <button
                  id="checkout-bag-cta"
                  onClick={() => setStep('shipping')}
                  className="w-full bg-black hover:bg-[#2F58CD] text-white py-3.5 px-4 text-xs font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md"
                >
                  Proceed to Secure Checkout
                  <ArrowRight size={14} />
                </button>
              )}

              {step === 'shipping' && (
                <button
                  id="checkout-shipping-cta"
                  onClick={handleNextToPayment}
                  className="w-full bg-black hover:bg-[#2F58CD] text-white py-3.5 px-4 text-xs font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  Confirm Shipping & Pay
                  <ArrowRight size={14} />
                </button>
              )}

              {step === 'payment' && (
                <button
                  id="checkout-payment-cta"
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder}
                  className="w-full bg-black hover:bg-emerald-600 text-white py-3.5 px-4 text-xs font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  {isProcessingOrder ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Securing Order...
                    </>
                  ) : (
                    <>
                      Place Secure Order
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

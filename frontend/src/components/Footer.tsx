import React from 'react';
import Newsletter from './Newsletter';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  handleScrollToNewArrivals: () => void;
  setIsInformationOpen: (open: boolean) => void;
}

export default function Footer({
  setCurrentPage,
  handleScrollToNewArrivals,
  setIsInformationOpen,
}: FooterProps) {
  return (
    <footer id="app-footer" className="bg-neutral-50 border-t border-neutral-200 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="text-left space-y-4">
          <h2 className="text-2xl font-black text-black tracking-tighter uppercase">LuxeMarket</h2>
          <p className="text-neutral-500 text-xs leading-relaxed max-w-xs">
            Redefining luxury through architectural fashion, material precision engineering, and timeless aesthetic restraint.
          </p>
        </div>

        {/* Column 2: Quick Shop */}
        <div className="text-left flex flex-col gap-3">
          <h4 className="font-semibold text-xs tracking-widest uppercase text-black">Shop</h4>
          {[
            { label: 'New Arrivals', action: () => { setCurrentPage('home'); setTimeout(handleScrollToNewArrivals, 50); } },
            { label: 'Men', action: () => { setCurrentPage('men'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
            { label: 'Women', action: () => { setCurrentPage('women'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
            { label: 'Accessories', action: () => { setCurrentPage('accessories'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
          ].map((cat) => (
            <button
              id={`footer-link-shop-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
              key={cat.label}
              onClick={cat.action}
              className="text-neutral-500 hover:text-black text-xs text-left cursor-pointer transition-colors"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Column 3: Customer Service */}
        <div className="text-left flex flex-col gap-3">
          <h4 className="font-semibold text-xs tracking-widest uppercase text-black">Information</h4>
          <button
            id="footer-shipping-btn"
            onClick={() => setIsInformationOpen(true)}
            className="text-neutral-500 hover:text-black text-xs text-left cursor-pointer transition-colors"
          >
            Complimentary Shipping
          </button>
          <button
            id="footer-returns-btn"
            onClick={() => setIsInformationOpen(true)}
            className="text-neutral-500 hover:text-black text-xs text-left cursor-pointer transition-colors"
          >
            30-Day Policy
          </button>
          <button
            id="footer-sustainability-btn"
            onClick={() => setIsInformationOpen(true)}
            className="text-neutral-500 hover:text-black text-xs text-left cursor-pointer transition-colors"
          >
            Material Integrity
          </button>
        </div>

        {/* Column 4: Newsletter Component */}
        <div className="text-left">
          <Newsletter />
        </div>

      </div>

      {/* Bottom copyright margin */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 mt-16 pt-8 border-t border-neutral-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} LuxeMarket. All Rights Reserved. Precision Engineered.</p>
        <div className="flex gap-6">
          <button onClick={() => setIsInformationOpen(true)} className="hover:text-black transition-colors cursor-pointer">Terms</button>
          <button onClick={() => setIsInformationOpen(true)} className="hover:text-black transition-colors cursor-pointer">Privacy</button>
        </div>
      </div>
    </footer>
  );
}

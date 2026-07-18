import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3500);
    }, 1000);
  };

  return (
    <div id="newsletter-form-container" className="flex flex-col gap-4">
      <h4 className="font-semibold text-xs tracking-widest uppercase text-black">Newsletter</h4>
      <p className="text-neutral-500 text-xs leading-relaxed max-w-xs">
        Subscribe to receive premium private access codes, early previews, and seasonal catalogs.
      </p>

      <form onSubmit={handleSubmit} className="relative mt-2">
        <div className="flex border-b border-black py-1.5 focus-within:border-[#2F58CD] transition-colors items-center">
          <input
            id="newsletter-email-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg('');
            }}
            placeholder="Email Address"
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-black w-full placeholder:text-neutral-400 placeholder:tracking-wider"
            required
            disabled={isSubmitting || isSubscribed}
          />
          <button
            id="newsletter-join-btn"
            type="submit"
            disabled={isSubmitting || isSubscribed}
            className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#2F58CD] disabled:text-neutral-400 px-2 shrink-0 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin block" />
            ) : isSubscribed ? (
              <Check size={14} className="text-emerald-600 animate-bounce" />
            ) : (
              'Join'
            )}
          </button>
        </div>

        {errorMsg && (
          <p id="newsletter-error" className="text-red-500 text-[10px] mt-1.5 font-medium">
            {errorMsg}
          </p>
        )}

        <AnimatePresence>
          {isSubscribed && (
            <motion.p
              id="newsletter-success"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-emerald-600 text-[10px] font-bold tracking-wider uppercase mt-2"
            >
              Exclusive access list unlocked!
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

import React from 'react';

interface SignupPageProps {
  signupName: string;
  setSignupName: (val: string) => void;
  signupEmail: string;
  setSignupEmail: (val: string) => void;
  signupPassword: string;
  setSignupPassword: (val: string) => void;
  signupConfirmPassword: string;
  setSignupConfirmPassword: (val: string) => void;
  signupIsSeller: boolean;
  setSignupIsSeller: (val: boolean) => void;
  signupError: string | null;
  setSignupError: (val: string | null) => void;
  isSigningUp: boolean;
  handleSignupSubmit: (e: React.FormEvent) => void;
  setLoginError: (val: string | null) => void;
  setCurrentPage: (page: string) => void;
}

export default function SignupPage({
  signupName,
  setSignupName,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  signupConfirmPassword,
  setSignupConfirmPassword,
  signupIsSeller,
  setSignupIsSeller,
  signupError,
  setSignupError,
  isSigningUp,
  handleSignupSubmit,
  setLoginError,
  setCurrentPage,
}: SignupPageProps) {
  return (
    <section className="py-20 max-w-md mx-auto px-6 text-left">
      <div className="bg-white border border-neutral-100 p-8 rounded-lg shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-wider text-black">
            Create Profile
          </h1>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest">
            Join LuxeMarket Loyalty
          </p>
        </div>

        {signupError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">
            {signupError}
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Full Name
            </label>
            <input
              type="text"
              required
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              placeholder="Alexander Mercer"
              className="w-full p-3 border border-neutral-200 text-xs focus:outline-none focus:border-black rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full p-3 border border-neutral-200 text-xs focus:outline-none focus:border-black rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Password
            </label>
            <input
              type="password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-neutral-200 text-xs focus:outline-none focus:border-black rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-neutral-200 text-xs focus:outline-none focus:border-black rounded-sm"
            />
          </div>

          {/* Seller signup option checkbox */}
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="signupIsSeller"
              checked={signupIsSeller}
              onChange={(e) => setSignupIsSeller(e.target.checked)}
              className="w-4 h-4 accent-black cursor-pointer rounded-xs border-neutral-300"
            />
            <label htmlFor="signupIsSeller" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 cursor-pointer select-none">
              Register as Seller (Access Admin Console)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-black text-white hover:bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest disabled:opacity-40 transition-colors shadow-md rounded-sm cursor-pointer"
          >
            {isSigningUp ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <button
              onClick={() => { setLoginError(null); setCurrentPage('login'); }}
              className="font-bold text-black hover:underline cursor-pointer"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

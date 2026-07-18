import React from 'react';

interface LoginPageProps {
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  loginError: string | null;
  setLoginError: (val: string | null) => void;
  isLoggingIn: boolean;
  handleLoginSubmit: (e: React.FormEvent) => void;
  setSignupError: (val: string | null) => void;
  setCurrentPage: (page: string) => void;
}

export default function LoginPage({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginError,
  setLoginError,
  isLoggingIn,
  handleLoginSubmit,
  setSignupError,
  setCurrentPage,
}: LoginPageProps) {
  return (
    <section className="py-20 max-w-md mx-auto px-6 text-left">
      <div className="bg-white border border-neutral-100 p-8 rounded-lg shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-wider text-black">
            Sign In
          </h1>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest">
            Access Your Luxury Garments
          </p>
        </div>

        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
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
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-neutral-200 text-xs focus:outline-none focus:border-black rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-black text-white hover:bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest disabled:opacity-40 transition-colors shadow-md rounded-sm cursor-pointer flex items-center justify-center"
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            Don't have an account?{' '}
            <button
              onClick={() => { setSignupError(null); setCurrentPage('signup'); }}
              className="font-bold text-black hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

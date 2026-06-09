'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function FirstLoginProps() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Centralized Style Tokens
  const brandStyles = {
    '--brand-primary': '#ccff66',       
    '--brand-primary-hover': '#5c0017', 
    '--brand-light': '#fdf8f9',         
  } as React.CSSProperties;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Password updated successfully');
      // API integration endpoint here (e.g., await updatePassword().unwrap())
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={brandStyles} className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fcfcfc] font-sans overflow-hidden">
      
      {/* Left Column: Visual Brand Image Showcase (Visible on Large Screens) */}
      <div className="hidden lg:block relative bg-[#1c0d12] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        {/* Next.js Production-optimized Fill Pattern */}
        <Image
          src="/image1.jpg" 
          alt="Restaurant Operations"
          fill
          sizes="50vw"
          className="object-cover scale-105 transition-transform duration-[10s] hover:scale-110"
          priority 
        />
        
        {/* Branding Floating Text Group */}
        <div className="absolute inset-0 z-20 p-16 flex flex-col justify-between text-white">
          <div>
            <span className="text-xl font-bold tracking-[0.3em] uppercase">Velvet.</span>
            <div className="w-12 h-[1px] bg-white/40 mt-2" />
          </div>
          
          <div className="max-w-md space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">
              Internal Operations Portal
            </span>
            <h2 className="text-4xl font-light tracking-wide uppercase leading-tight">
              Crafting <br />
              <span className="font-medium">Exceptional Dining.</span>
            </h2>
            <p className="text-sm text-slate-300/90 font-light leading-relaxed">
              Access your team dashboard, manage daily service schedules, review live kitchen coordination templates, and sync your inventory assignments instantly.
            </p>
          </div>
          
          <div className="flex justify-between items-center text-[10px] tracking-widest text-slate-400 uppercase">
            <span>© 2026 Velvet </span>
            <span>Privacy Secured —</span>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Form Workspace */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100">
          
          {/* Header Context */}
          <div className="text-center mb-8">
            <span 
              style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3"
            >
              First Day On Board
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
              Activate Your Account
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              Welcome, new member. Create your personal password to access your premium portal.
            </p>
          </div>

          {/* Form Actions */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error System */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50/70 border border-red-100 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            {/* Target Fields */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm tracking-widest"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm tracking-widest"
              />
            </div>

            {/* Production Grade Button Action Trigger */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                backgroundColor: isLoading ? 'var(--brand-primary-hover)' : 'var(--brand-primary)'
              }}
              className="w-full text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all text-xs tracking-widest uppercase shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95"
            >
              {isLoading ? 'Saving Configuration...' : 'Activate Account'}
            </button>
          </form>

          <p className="text-center text-[11px] tracking-wide text-slate-400 mt-8">
            Need assistance? <span className="underline cursor-pointer text-slate-500 font-medium">Contact Support</span>
          </p>
        </div>
      </div>

    </div>
  );
}
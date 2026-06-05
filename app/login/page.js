'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRAND_COLOR = '#800020' // Velvet Maroon

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [focusedField, setFocusedField] = useState('')

  const handleFocus = (fieldName) => setFocusedField(fieldName)
  const handleBlur = () => setFocusedField('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Logging in with:', formData)
  }

  return (
    <main className="w-full min-h-screen flex flex-row bg-neutral-50 select-none">
      
      {/* ─── LEFT SIDE: ARTISTIC BRAND PANEL (Visible on Desktop) ─── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-neutral-900 flex-col justify-between p-14">
        
        {/* Background Image with Deep Maroon Tint Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000&auto=format&fit=crop&q=80" 
          alt="Luxury Fashion Fabric" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105 transition-transform duration-[10s] hover:scale-100"
        />
        <div 
          className="absolute inset-0 opacity-75 mix-blend-multiply"
          style={{ backgroundColor: BRAND_COLOR }}
        />
        
        {/* Top Branding Logo Accent */}
        <div className="relative z-10">
          <Link href="/" className="text-white text-lg font-sans font-bold tracking-[0.3em] uppercase">
            V E L V E T <span className="text-amber-400">.</span>
          </Link>
        </div>

        {/* Center Captivating Typography */}
        <div className="relative z-10 my-auto max-w-sm">
          <span className="text-[10px] tracking-[0.3em] font-mono text-amber-400 uppercase block mb-3">
            The Patron Club
          </span>
          <h1 className="text-3xl xl:text-4xl font-light tracking-widest text-white leading-relaxed uppercase mb-4">
            Step into timeless elegance.
          </h1>
          <p className="text-xs text-neutral-300/80 font-sans font-light tracking-wide leading-relaxed">
            Access your curated private wardrobe dashboard, track seasonal custom orders, and unlock bespoke priority checkout.
          </p>
        </div>

        {/* Footer Micro Tag */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 w-full">
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            © 2026 VELVET ATELIER
          </span>
          <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase">
            PRIVACY SECURED ✦
          </span>
        </div>
      </div>

      {/* ─── RIGHT SIDE: PREMIUM INTERACTIVE LOGIN FORM ─── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        
        {/* Decorative background blur blobs for creative premium aesthetic */}
        <div 
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full filter blur-[100px] opacity-10 pointer-events-none"
          style={{ backgroundColor: BRAND_COLOR }}
        />
        
        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 sm:p-10 border border-neutral-100 shadow-xl shadow-neutral-200/40 relative z-10">
          
          {/* Header Identity for Mobile View */}
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden mb-4">
              <span className="text-base font-bold tracking-[0.25em] uppercase" style={{ color: BRAND_COLOR }}>
              VELURE.
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-wider text-neutral-800 uppercase">
              Welcome Back
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-2 tracking-wide">
              Enter your credentials to access your premium portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            
            {/* Input Wrapper: Email */}
            <div className="relative w-full">
              <label 
                htmlFor="email"
                className={`absolute left-4 transition-all duration-300 font-sans tracking-wider pointer-events-none uppercase text-[10px] font-semibold
                  ${focusedField === 'email' || formData.email
                    ? 'top-2 opacity-100' 
                    : 'top-4 opacity-40'
                  }`}
                style={{ color: focusedField === 'email' ? BRAND_COLOR : '#737373' }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                required
                className={`w-full bg-neutral-50 border rounded-2xl px-4 font-sans text-xs tracking-wide transition-all duration-300 outline-none
                  ${focusedField === 'email' 
                    ? 'pt-6 pb-2 border-neutral-800 bg-white shadow-sm shadow-neutral-100' 
                    : 'py-4 border-neutral-200/70'
                  }`}
              />
            </div>

            {/* Input Wrapper: Password */}
            <div className="relative w-full">
              <label 
                htmlFor="password"
                className={`absolute left-4 transition-all duration-300 font-sans tracking-wider pointer-events-none uppercase text-[10px] font-semibold
                  ${focusedField === 'password' || formData.password
                    ? 'top-2 opacity-100' 
                    : 'top-4 opacity-40'
                  }`}
                style={{ color: focusedField === 'password' ? BRAND_COLOR : '#737373' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                required
                className={`w-full bg-neutral-50 border rounded-2xl px-4 font-sans text-xs tracking-wide transition-all duration-300 outline-none
                  ${focusedField === 'password' 
                    ? 'pt-6 pb-2 border-neutral-800 bg-white shadow-sm shadow-neutral-100' 
                    : 'py-4 border-neutral-200/70'
                  }`}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end -mt-1">
              <Link 
                href="comingsoon"
                className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 hover:text-black transition-colors duration-200 uppercase underline underline-offset-2"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Premium CTA Button */}
            <button
              type="submit"
              className="w-full text-white font-sans text-xs font-bold tracking-[0.2em] py-4 rounded-2xl uppercase transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-neutral-200 hover:-translate-y-0.5"
              style={{ backgroundColor: BRAND_COLOR }}
            >
              Sign In to Account
            </button>

          </form>

          {/* Bottom Navigation Alternate Link */}
          <div className="text-center mt-8 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 font-sans tracking-wide">
              New to Velvet?{' '}
              <Link 
                href="/signup" 
                className="font-semibold underline underline-offset-4 hover:text-black transition-colors duration-200 uppercase text-[11px] tracking-wider ml-1"
                style={{ color: BRAND_COLOR }}
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </main>
  )
}
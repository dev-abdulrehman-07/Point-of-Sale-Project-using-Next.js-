'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRAND_COLOR = '#800020' // Velvet Maroon

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false
  })
  const [focusedField, setFocusedField] = useState('')

  const handleFocus = (fieldName) => setFocusedField(fieldName)
  const handleBlur = () => setFocusedField('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registering user with:', formData)
  }

  return (
    <main className="w-full min-h-screen flex flex-row bg-neutral-50 select-none">
      
      {/* ─── LEFT SIDE: ARTISTIC BRAND PANEL ─── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-neutral-900 flex-col justify-between p-14">
        
        {/* Background Image Asset with Deep Maroon Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&auto=format&fit=crop&q=80" 
          alt="Luxury Fashion Curation" 
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 transition-transform duration-[12s] hover:scale-100"
        />
        <div 
          className="absolute inset-0 opacity-80 mix-blend-multiply"
          style={{ backgroundColor: BRAND_COLOR }}
        />
        
        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="text-white text-lg font-sans font-bold tracking-[0.3em] uppercase">
            V E L V E T <span className="text-amber-400">.</span>
          </Link>
        </div>

        {/* Center Typography */}
        <div className="relative z-10 my-auto max-w-sm">
          <span className="text-[10px] tracking-[0.3em] font-mono text-amber-400 uppercase block mb-3">
            The Inner Circle
          </span>
          <h1 className="text-3xl xl:text-4xl font-light tracking-widest text-white leading-relaxed uppercase mb-4">
            Begin Your Sartorial Journey.
          </h1>
          <p className="text-xs text-neutral-300/80 font-sans font-light tracking-wide leading-relaxed">
            Create an elite profile to access seasonal custom bespoke drops, manage sizing blueprints, and unlock private insider privileges.
          </p>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 w-full">
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            © 2026 VELVET ATELIER
          </span>
          <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase">
            SECURE RECRUITMENT ✦
          </span>
        </div>
      </div>

      {/* ─── RIGHT SIDE: PREMIUM INTERACTIVE REGISTER FORM ─── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        
        {/* Ambient Maroon Blur Blob */}
        <div 
          className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full filter blur-[120px] opacity-10 pointer-events-none"
          style={{ backgroundColor: BRAND_COLOR }}
        />
        
        <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-10 border border-neutral-100 shadow-xl shadow-neutral-200/40 relative z-10">
          
          {/* Header */}
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden mb-4">
              <span className="text-base font-bold tracking-[0.25em] uppercase" style={{ color: BRAND_COLOR }}>
                VELVET
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-wider text-neutral-800 uppercase">
              Create Account
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-2 tracking-wide">
              Join us to experience meticulous modern craftsmanship.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            
            {/* Flex Row Wrapper for First & Last Name */}
            <div className="w-full flex flex-col sm:flex-row gap-4">
              
              {/* First Name */}
              <div className="relative flex-1">
                <label 
                  htmlFor="firstName"
                  className={`absolute left-4 transition-all duration-300 font-sans tracking-wider pointer-events-none uppercase text-[9px] font-semibold
                    ${focusedField === 'firstName' || formData.firstName ? 'top-2 opacity-100' : 'top-4 opacity-40'}`}
                  style={{ color: focusedField === 'firstName' ? BRAND_COLOR : '#737373' }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => handleFocus('firstName')}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-neutral-50 border rounded-2xl px-4 font-sans text-xs tracking-wide transition-all duration-300 outline-none
                    ${focusedField === 'firstName' ? 'pt-6 pb-2 border-neutral-800 bg-white shadow-sm' : 'py-4 border-neutral-200/70'}`}
                />
              </div>

              {/* Last Name */}
              <div className="relative flex-1">
                <label 
                  htmlFor="lastName"
                  className={`absolute left-4 transition-all duration-300 font-sans tracking-wider pointer-events-none uppercase text-[9px] font-semibold
                    ${focusedField === 'lastName' || formData.lastName ? 'top-2 opacity-100' : 'top-4 opacity-40'}`}
                  style={{ color: focusedField === 'lastName' ? BRAND_COLOR : '#737373' }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => handleFocus('lastName')}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-neutral-50 border rounded-2xl px-4 font-sans text-xs tracking-wide transition-all duration-300 outline-none
                    ${focusedField === 'lastName' ? 'pt-6 pb-2 border-neutral-800 bg-white shadow-sm' : 'py-4 border-neutral-200/70'}`}
                />
              </div>

            </div>

            {/* Input: Email */}
            <div className="relative w-full">
              <label 
                htmlFor="email"
                className={`absolute left-4 transition-all duration-300 font-sans tracking-wider pointer-events-none uppercase text-[9px] font-semibold
                  ${focusedField === 'email' || formData.email ? 'top-2 opacity-100' : 'top-4 opacity-40'}`}
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
                  ${focusedField === 'email' ? 'pt-6 pb-2 border-neutral-800 bg-white shadow-sm' : 'py-4 border-neutral-200/70'}`}
              />
            </div>

            {/* Input: Password */}
            <div className="relative w-full">
              <label 
                htmlFor="password"
                className={`absolute left-4 transition-all duration-300 font-sans tracking-wider pointer-events-none uppercase text-[9px] font-semibold
                  ${focusedField === 'password' || formData.password ? 'top-2 opacity-100' : 'top-4 opacity-40'}`}
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
                  ${focusedField === 'password' ? 'pt-6 pb-2 border-neutral-800 bg-white shadow-sm' : 'py-4 border-neutral-200/70'}`}
              />
            </div>

            {/* Premium Terms Agreement Checkbox (Flex Row Layout) */}
            <div className="flex flex-row items-start gap-3 mt-1 px-1">
              <label className="relative flex items-center h-5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  className="peer sr-only"
                />
                {/* Custom Checkbox Frame */}
                <div 
                  className="w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center text-white text-[9px] peer-checked:bg-neutral-800 peer-checked:border-neutral-800 border-neutral-300 bg-neutral-50"
                  style={{ backgroundColor: formData.agreeTerms ? BRAND_COLOR : undefined, borderColor: formData.agreeTerms ? BRAND_COLOR : undefined }}
                >
                  ✓
                </div>
              </label>
              <span className="text-[11px] font-sans text-neutral-400 tracking-wide leading-tight">
                I agree to the <Link href="/terms" className="underline text-neutral-600 hover:text-black">Terms of Service</Link> and <Link href="/privacy" className="underline text-neutral-600 hover:text-black">Privacy Policy</Link>.
              </span>
            </div>

            {/* Registration CTA Button */}
            <button
              type="submit"
              className="w-full text-white font-sans text-xs font-bold tracking-[0.2em] py-4 mt-2 rounded-2xl uppercase transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-neutral-200 hover:-translate-y-0.5"
              style={{ backgroundColor: BRAND_COLOR }}
            >
              Create Account
            </button>

          </form>

          {/* Alternate Navigation Link */}
          <div className="text-center mt-6 pt-5 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 font-sans tracking-wide">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-semibold underline underline-offset-4 hover:text-black transition-colors duration-200 uppercase text-[11px] tracking-wider ml-1"
                style={{ color: BRAND_COLOR }}
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>

    </main>
  )
}
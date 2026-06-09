'use client'
import React, { PropsWithChildren, useState } from 'react'
import SideBar from "@/components/POS-interface-Components/sideBar"
import { UserRound, Menu, X, LayoutDashboard, Users, ShoppingCart, Settings, LogOut, HelpCircle } from 'lucide-react'

function AdminLayout({ children }: PropsWithChildren) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  // موبائل مینیو کے لنکس (انہیں آپ اپنے پروجیکٹ کے روٹس کے مطابق بدل سکتے ہیں)
  const mobileNavLinks = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { label: 'Manage Employees', icon: <Users size={20} />, active: false },
    { label: 'POS Counter', icon: <ShoppingCart size={20} />, active: false },
    { label: 'Settings', icon: <Settings size={20} />, active: false },
    { label: 'Support', icon: <HelpCircle size={20} />, active: false },
  ]

  return (
    <div className='min-h-screen w-full flex bg-black overflow-x-hidden relative select-none'>

      {/* 1. ڈیسک ٹاپ سائیڈ بار (Laptop & Larger Screens) */}
      <aside className='sticky top-0 h-screen z-20 hidden md:flex flex-shrink-0 pl-2 py-2'>
        <SideBar />
      </aside>

      {/* 2. بالکل الگ پریمیم موبائل مینیو (Mobile Drawer) */}
      <div className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 md:hidden flex flex-col ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        
        {/* موبائل مینیو ہیڈر */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-jersey text-2xl tracking-tight">MARIADB MART</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 bg-gray-50 border rounded-xl text-gray-700 active:scale-95 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        {/* پریمیم موبائل نیویگیشن لنکس لسٹ */}
        <nav className="flex-1 px-4 py-6 space-y-2.5 overflow-y-auto">
          {mobileNavLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full flex items-center gap-x-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] ${
                link.active 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              <span className={link.active ? 'text-[#ccff66]' : 'text-gray-400'}>
                {link.icon}
              </span>
              {link.label}
            </button>
          ))}
        </nav>

        {/* موبائل مینیو فوٹر (یوزر پروفائل + لاگ آؤٹ) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-x-3">
              <div className="h-10 w-10 rounded-full border p-1.5 flex justify-center items-center bg-gray-50">
                <UserRound size={18} className="text-gray-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Abdul Rehman</h4>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Counter Staff</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. مین کنٹینٹ ایریا (Main Content Section) */}
      <main className='flex-1 min-h-screen bg-white rounded-t-[2rem] md:rounded-t-none md:rounded-l-[2.5rem] flex flex-col shadow-sm mt-2 md:mt-0'>

        {/* ہیڈر سیکشن */}
        <header className="w-full h-[68px] xl:h-[78px] flex items-center justify-between px-4 lg:px-10 border-b border-gray-50 flex-shrink-0">
          
          <div className="flex items-center gap-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 border rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 md:hidden transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-jersey text-xl sm:text-2xl xl:text-[42px] tracking-tight whitespace-nowrap">
              MARIADB MART
            </h1>
          </div>

          {/* رائٹ سائیڈ: یوزر پروفائل (ڈیسک ٹاپ کے لیے) */}
          <div className="flex items-center gap-x-2 sm:gap-x-3">
            <div className="h-8 w-8 rounded-full border p-1.5 flex justify-center items-center bg-gray-50">
              <UserRound size={16} className="text-gray-600" />
            </div>
            <div className="flex justify-center flex-col">
              <h1 className="text-xs sm:text-sm font-medium leading-tight">Abdul Rehman</h1>
              <div className="flex items-center gap-x-1.5 mt-0.5">
                <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-semibold">Counter</p>
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff66] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#ccff66]"></span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ڈائنامک پیجز (Children) */}
        <section className='flex-1 p-4 md:p-6 overflow-y-auto'>
          {children}
        </section>

      </main>
    </div>
  )
}

export default AdminLayout
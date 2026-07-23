"use client"
import AddproductComponent from '@/components/product-management-comp/addproduct';
import Liveproducts from '@/components/product-management-comp/liveproducts';
import { PackagePlus, RotateCcw, Search, ChevronDown, Package, X } from 'lucide-react';

import { useTransitionRouter } from 'next-transition-router'; 

export default function ProductManagementSystem() {
  const router = useTransitionRouter(); 

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-8 font-sans antialiased selection:bg-[#d9f99d] rounded-2xl pt-10">
      
      

           <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `#faffef`, color: "#ccff66" }}
          >
            <Search size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Product Management System
            </h1>
            <p className="text-sm text-gray-500">
              Search, Add, Remove, Update and manage items
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[24px] border border-[#f1f5f9] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8">
        <div className="space-y-2 mb-1">
          <label className="block text-sm font-semibold text-[#475569]">
            Select Product <span className="text-red-500 ml-0.5">*</span>
          </label>
        </div>

        <Liveproducts />
        
        <hr className="border-[#f1f5f9] mb-6" />
        
        <div className="flex justify-between items-center">
          <button className="flex items-center gap-2 px-5 py-3 border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-xl text-sm font-semibold text-[#475569] bg-white hover:bg-[#f8fafc] transition-all duration-200">
            <RotateCcw className="w-4 h-4 text-[#475569]" />
            Reset Form
          </button>

          <button
            onClick={() => router.push('/productmanagement/addproducts')}
            className='flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm bg-[#ccff66] text-gray-900 hover:bg-[#bbf055]'
          >
            <PackagePlus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import { Minus, Plus, Trash2, FileText, Bookmark } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/RTK/store'; 
import { addToOrder, decreaseQuantity, removeFromOrder, clearPOS } from '@/lib/RTK/posSlice'; // removeFromOrder import kiya

function BillComponent() {
  const dispatch = useAppDispatch(); 
  
  // Sahi Tareeqa: Sirf redux se state read karein. Next.js crash bilkul solve!
  const cartItems = useAppSelector((state) => state.pos.order);
  const activeEmployee = useAppSelector((state) => state.pos.activeEmployee);

  // Bill Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.16); 
  const total = subtotal + gst;

  return (
    // Fixed Height Container
    <div className="h-screen w-full bg-white p-6 flex flex-col justify-between border-l border-gray-200 sticky top-2.5">
      
      {/* 1. Top Heading Section */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-black tracking-wider uppercase text-black flex items-center justify-between">
          <span>Current Order</span>
          <span className="text-xs bg-black text-[#CCFF66] px-2 py-1 rounded-md font-bold">
            {cartItems.length} Items
          </span>
        </h2>
        
        {/* Cashier Context UI */}
        {activeEmployee && (
          <p className="text-xs text-gray-500 mt-2">
            Cashier: <span className="font-bold text-black">{activeEmployee.name}</span>
          </p>
        )}
      </div>

      {/* 2. Scrollable Cart Items Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
            <span>🛒</span>
            <span>Cart is empty</span>
          </div>
        ) : (
          cartItems.map((item) => (
            <div 
              key={item.id} 
              className="group flex flex-col p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-black hover:shadow-sm transition-all duration-200"
            >
              {/* Top row: Title and Remove */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-base text-gray-900 truncate">{item.title}</span>
                
                {/* Trash Button: Ab direct filter action hit karega single click par */}
                <button 
                  onClick={() => dispatch(removeFromOrder(item.id))}
                  className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* Bottom row: Counter and Price */}
              <div className="flex items-center justify-between mt-4">
                {/* Modern Minimal Counter */}
                <div className="flex items-center border border-gray-300 rounded-xl p-1 bg-white shadow-sm">
                  {/* Minus Button Action */}
                  <button 
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition"
                  >
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  
                  <span className="px-3 font-bold text-sm text-gray-900">{item.quantity}</span>
                  
                  {/* Plus Button Action */}
                  <button 
                    onClick={() => dispatch(addToOrder(item))}
                    className="text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>
                
                {/* Formatted Price */}
                <span className="font-extrabold text-gray-900 text-sm tracking-wide">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Bottom Calculation & Action Area */}
      <div className="border-t border-gray-200 pt-4 mt-4 space-y-3 bg-white">
        
        {/* Pricing Rows */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-gray-500 font-medium">
            <span>GST (16%)</span>
            <span className="font-bold text-gray-900">Rs. {gst.toLocaleString()}</span>
          </div>
        </div>

        {/* Grand Total Row */}
        <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        {/* Primary Action Button */}
        <button 
          disabled={cartItems.length === 0}
          onClick={() => {
            console.log("Saving Order Data to Database:", { items: cartItems, subtotal, gst, total });
            alert("Order Processed Successfully!");
            dispatch(clearPOS()); 
          }}
          className="w-[70%] bg-[#CCFF66] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-black font-black text-base py-4 px-6 ml-12 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-widest mt-2 block"
        >
          Process Order
        </button>

        {/* Secondary Actions */}
        <div className="flex justify-center gap-4 pt-2 text-xs font-bold text-gray-400">
          <button className="hover:text-black flex items-center gap-1.5 transition">
            <FileText size={14} /> Add Note
          </button>
          <span>•</span>
          <button className="hover:text-black flex items-center gap-1.5 transition">
            <Bookmark size={14} /> Save for Later
          </button>
        </div>
      </div>

    </div>
  );
}

export default BillComponent;
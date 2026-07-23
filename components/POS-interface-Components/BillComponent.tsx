"use client";

import React, { useState } from 'react';
import { Minus, Plus, Trash2, FileText, Bookmark } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/store'; 
import { addToOrder, decreaseQuantity, removeFromOrder, clearPOS, calulatetotals } from '@/lib/store/Slices/posSlice';
import PaymentSelection from './PaymentSelection';
import { useTransitionRouter } from 'next-transition-router';

function BillComponent() {
  const router = useTransitionRouter()
  const [afterBill, setAfterBill] = useState<boolean>(true)
  const dispatch = useAppDispatch(); 
  
  const cartItems = useAppSelector((state) => state.pos.order);
  const activeEmployee = useAppSelector((state) => state.pos.activeEmployee);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.16); 
  const total = subtotal + gst;





  return (
    <div className="h-screen w-full bg-white p-6 flex flex-col justify-between border-l border-gray-200 sticky top-2.5">

      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-black tracking-wider uppercase text-black flex items-center justify-between">
          <span>Current Order</span>
          <span className="text-xs bg-black text-[#CCFF66] px-2 py-1 rounded-md font-bold">
            {cartItems.length} Items
          </span>
        </h2>
        {activeEmployee && (
          <p className="text-xs text-gray-500 mt-2">
            Cashier: <span className="font-bold text-black">{activeEmployee.name}</span>
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
            <span>🛒</span>
            <span>Cart is empty</span>
          </div>
        ) : (
          cartItems.map((item) => (
            <div 
              key={item._id as string} 
              className="group flex flex-col p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-black hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-base text-gray-900 truncate">{item.title}</span>
                
                <button 
                  onClick={() => dispatch(removeFromOrder(item._id as string))}
                  className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              

              <div className="flex items-center justify-between mt-4">
      
                <div className="flex items-center border border-gray-300 rounded-xl p-1 bg-white shadow-sm">
                 
                  <button 
                    onClick={() => dispatch(decreaseQuantity(item._id as string))}
                    className="text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition"
                  >
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  
                  <span className="px-3 font-bold text-sm text-gray-900">{item.quantity}</span>
                  
                  <button 
                    onClick={() => dispatch(addToOrder(item))}
                    className="text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>
                
                <span className="font-extrabold text-gray-900 text-sm tracking-wide">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4 space-y-3 bg-white">
        
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

        <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        <button 
          disabled={cartItems.length === 0}
          onClick={() => {
            dispatch(calulatetotals({
              subtotal,
              gst,
              total,

            }))
            console.log("Saving Order Data to Database:", { items: cartItems, subtotal, gst, total });
            router.push("checkout")
             
          }}
          className="w-[70%] bg-[#CCFF66] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-black font-black text-base py-4 px-6 ml-12 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-widest mt-2 block"
        >
          Process Order
        </button>

        
      </div>

    </div>
  );
}


export default BillComponent;
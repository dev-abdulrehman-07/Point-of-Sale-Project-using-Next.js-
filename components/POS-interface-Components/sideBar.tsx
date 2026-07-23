'use client'
import React from 'react';
import { useTransitionRouter } from 'next-transition-router';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Receipt, 
  Users, 
  UserSquare2, 
  Settings,
  LaptopMinimal, 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function SideBar() {
  const router = useTransitionRouter();

  const menuItems = [
    { icon: LaptopMinimal, label: 'Work' , route : "/point-of-sale" },
    { icon: LayoutDashboard, label: 'Dashboard' ,route : "/point-of-sale/dashboard"},
    { icon: ShoppingBag, label: 'Orders' ,route : "/point-of-sale/orders"},
    { icon: Receipt, label: 'Order History' , route : "/point-of-sale/orderhistory" },
    { icon: Settings, label: 'Settings' , route : "/point-of-sale/settings" },
  ];

  return (
    <div className='bg-[#111111] w-full h-screen rounded-r-4xl border-r border-[#333] flex flex-col items-center py-8 gap-8 sticky top-1'>
      
      <div className='flex flex-col items-center gap-6 flex-1 w-full'>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={index} 
              title={item.label} 
              onClick={()=>router.push(`${item.route} `)}
              className='group relative p-3 rounded-xl hover:bg-black/50 transition-all duration-200 cursor-pointer'
            >
              <IconComponent 
                size={24} 
                className='stroke-[#ccff66] group-hover:scale-105 transition-transform duration-200'
                style={{ filter: 'drop-shadow(0 0 4px rgba(204,255,102,0.3))' }}
              />
              <span className='absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50'>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

        
    </div>
  );
}

export default SideBar;
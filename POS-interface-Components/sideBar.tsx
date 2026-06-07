import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Receipt, 
  Users, 
  UserSquare2, 
  Settings 
} from 'lucide-react';

function SideBar() {
  // POS ke standard links ka array, matching image modules
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: ShoppingBag, label: 'POS Register' },
    { icon: Package, label: 'Inventory' },
    { icon: Receipt, label: 'Order History' },
    { icon: Users, label: 'Customers' },
    { icon: UserSquare2, label: 'Employees/Staff' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    // Deep Dark background with rounded corners on the right.
    // w-full uses the full 80px of the grid column.
    <div className='bg-[#111111] w-full h-full rounded-r-4xl border-r border-[#333] flex flex-col items-center py-8 gap-8 sticky top-1'>
      
      {/* Top Section: Integrated POS Logo/Brand */}
      

      {/* Middle Section: Main POS Menu Items */}
      <div className='flex flex-col items-center gap-6 flex-1 w-full'>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={index} 
              title={item.label} // Desktop standard: shows label on hover since sidebar is narrow
              className='group relative p-3 rounded-xl hover:bg-black/50 transition-all duration-200 cursor-pointer'
            >
              <IconComponent 
                size={24} 
                className='stroke-[#ccff66] group-hover:scale-105 transition-transform duration-200' 
                // Premium glow effect applied via drop-shadow
                style={{ filter: 'drop-shadow(0 0 4px rgba(204,255,102,0.3))' }}
              />
              
              {/* Tooltip - only visible on hover */}
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
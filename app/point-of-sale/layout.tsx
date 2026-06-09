import SideBar from '@/components/POS-interface-Components/sideBar';
import React, { PropsWithChildren } from 'react';

function PointOfSaleLayout({children}:PropsWithChildren) {
  return (
    <div className='flex min-h-screen w-full'>
      <div className="relative">
        <div className="sticky top-2">
          <SideBar/>
        </div>
      </div>
      <div className='flex-1'>
         {children}
      </div>
    </div>
  )
}

export default PointOfSaleLayout;
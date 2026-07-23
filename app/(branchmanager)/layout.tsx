"use client";
import React, { PropsWithChildren, useState } from "react";
import SideBar from "@/components/martinventory-Comp/sidebar";

import { motion, AnimatePresence } from 'framer-motion';
import {
  UserRound,
  X,
  TextAlignStart,
} from "lucide-react";
import UserprofileComp from "@/components/POS-interface-Components/userprofileComp";
import Sidebar from "@/components/martinventory-Comp/sidebar";

function Inventory({ children }: PropsWithChildren) {
  const [OpenSidebar, setOpenSidebar] = useState(false)
  return (
    <div className="bg-black flex min-h-screen  rounded-2xl">
      <div className="sm:hidden">
        <AnimatePresence>
            {OpenSidebar && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
        
          animate={{ x: 0, opacity: 1 }}
        
          exit={{ x: '-100%', opacity: 0 }}
        
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        
          className="fixed top-0 left-0 z-50 flex h-screen"
        >
          <Sidebar />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            className="mt-5 ml-5 h-10 w-10 rounded-full p-2 bg-[#ccff66] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-transform"
            onClick={() => setOpenSidebar(prev =>!prev)}
          >
            <X className="h-full w-full text-black" />
          </motion.div>
        </motion.div>
            )}
          </AnimatePresence>
      </div>



<div className="hidden sm:block">
  <div className="max-h-screen   sticky top-0 left-0 overflow-hidden m-0">
<Sidebar />

  </div>
</div>

      <div className="border w-full rounded-3xl bg-white m-1">
        <div className="sm:hidden h-15 border-b mx-3 rounded-t-2xl flex justify-between items-center px-5 ">
        <h1 className="font-jersey text-[36px] ">
                MARIADB MART
              </h1>
        </div>
        <div className="h-15 sm:hidden  rounded-t-2xl border-b mx-3 flex justify-between items-center px-2 ">
          <div className="sm:hidden" onClick={()=>setOpenSidebar(prev =>!prev)}>
        
            <TextAlignStart className="h-8 w-8" />
          </div>
          <div className="flex justify-center items-center gap-x-1">
            <div className="h-6 w-6 p-1 rounded-full border">
              <UserRound className="h-full w-full " />
            </div>
            <div className="text-[10px] font-medium max-w-full overflow-hidden">
            <UserprofileComp/>
            </div>
          </div>
        </div>
            <div className="">
              {children}
            </div>
      </div>
    </div>
  );
}

export default Inventory;

"use client";

import React, { useState, useEffect } from "react";
import { UserRound, Maximize2, Minimize2 } from "lucide-react";
import ProductComponent from "@/components/POS-interface-Components/ProductComponent";
import BillComponent from "@/components/POS-interface-Components/BillComponent";
import UserprofileComp from "@/components/POS-interface-Components/userprofileComp";

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle logic
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error("Fullscreen toggle execution failed:", error);
    }
  };

  // Sync state if user exits via 'ESC' key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="bg-black grid grid-cols-1 lg:grid-cols-15 min-h-screen w-full overflow-hidden">
      
      {/* Main Workspace Column */}
      <main className="min-h-screen pb-3 bg-white rounded-t-4xl lg:rounded-l-4xl lg:rounded-tr-none col-span-1 lg:col-span-10 flex flex-col">
        
        {/* Responsive Header Container */}
        <header className="w-full h-auto py-4 lg:py-0 lg:h-[78px] flex justify-between items-center px-4 md:px-8 lg:grid lg:grid-cols-2 border-gray-100">
          
          {/* Left Side: Module Identity */}
          <div className="lg:pl-[52px] flex items-center">
            <h1 className="font-jersey text-2xl sm:text-3xl lg:text-[42px] text-black">CREATE ORDER</h1>
          </div>

          {/* Right Side: Interactive Actions */}
          <div className="flex h-full items-center justify-end gap-x-4 lg:pr-10">
            
            {/* Fullscreen Trigger Button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center p-2 rounded-full border border-neutral-300 bg-white text-black hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-sm"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-neutral-700" />
              ) : (
                <Maximize2 className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* Profile Content */}
            <div className="flex justify-center items-center gap-x-2">
              <div className="h-8 w-8 rounded-full border border-neutral-300 p-1.5 flex justify-center items-center bg-neutral-50">
                <UserRound className="w-4 h-4 text-neutral-600" />
              </div>
              <UserprofileComp />
            </div>

          </div>
        </header>
    
        {/* Scrollable Products Segment */}
        <section className="w-full flex-1 overflow-hidden ">
          <ProductComponent />
        </section>
      </main>

      {/* Bill Sidebar Column */}
      <aside className="col-span-1 lg:col-span-5 relative bg-black h-screen overflow-y-auto">
        <div className="lg:sticky lg:top-0 w-full h-full">
          <BillComponent />
        </div>
      </aside>

    </div>
  );
}
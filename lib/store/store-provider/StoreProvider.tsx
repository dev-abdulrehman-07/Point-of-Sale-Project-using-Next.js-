"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore,AppStore } from "@/lib/store/store";
import { hydrateOrder } from "@/lib/store/Slices/posSlice"; // Apni slice se action import karein

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  
  useEffect(() => {
    if (storeRef.current) {
      const savedOrder = localStorage.getItem("pos_order");
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          storeRef.current.dispatch(hydrateOrder(parsedOrder));
        } catch (error) {
          console.error("Failed to parse local storage order:", error);
        }
      }
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
} 
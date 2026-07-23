"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore,AppStore } from "@/lib/store/store";
import { hydrateOrder, totalhydrateOrder } from "@/lib/store/Slices/posSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  
  useEffect(() => {
    if (storeRef.current) {
      const savedOrder = localStorage.getItem("pos_order");
      const savedTotal = localStorage.getItem("pos_total");
      if (savedOrder || savedTotal) {
        try {
          const parsedOrder = JSON.parse(savedOrder as string);
          const parsedTotal = JSON.parse(savedTotal as string);
          storeRef.current.dispatch(hydrateOrder(parsedOrder));
          storeRef.current.dispatch(totalhydrateOrder(parsedTotal));
        } catch (error) {
          console.error("Failed to parse local storage order:", error);
        }
      }
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
} 
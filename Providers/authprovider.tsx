'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/store/store';
import { loginSet } from '@/lib/store/Slices/userInfo';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const savedUser = localStorage.getItem("velvetUser");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        dispatch(loginSet(parsedUser));
      } catch (error) {
        console.error("Local storage parse error:", error);
      }
    }
    
    setIsLoading(false); 
  }, [dispatch]);


  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        Loading POS System...
      </div>
    );
  }

  return <>{children}</>;
}
'use client'
import React from 'react';
import { 
  ArrowLeftRight,
  LayoutDashboard,
  Settings, 
  LogOut, 
  Podcast,
  Mail
} from 'lucide-react';
import { Link } from 'next-transition-router'; 
import { redirect, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/store/store';
import { useState ,useEffect} from 'react';
 import { useTransitionRouter } from 'next-transition-router';

interface NavItemProps {
  icon: React.ReactNode; 
  label: string;
  href?: string; 
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href = '#' }) => {
  const checkactive = usePathname()





  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
        ${checkactive === href
          ? 'bg-[#ccff66] text-black font-semibold' 
          : 'text-white hover:bg-zinc-900 hover:text-[#ccff66]'
        }`}
    >
      <div className={`transition-colors duration-200 ${checkactive === href ? 'text-black' : 'text-[#ccff66] group-hover:text-[#ccff66]'}`}>
        {icon}
      </div>
      <span className="text-sm tracking-wide">{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {

 const router = useTransitionRouter()
 const logout  = async()=>{
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const data = await response.json()
  
    if(data.status){
      localStorage.clear()
      router.replace('/')
       


    }else{
      router.replace('/')
    }
  } catch (error) {
    router.replace('/')
  }



}

   const [userInfo, setLocalUser] = useState<{ name: string | null; role: string | null }>(
    { name: null, role: null }
  )

   useEffect(() => { 
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("velvetUser");
      
      if (savedUser) {
        setLocalUser(JSON.parse(savedUser));
      } else {
        router.replace("/");
      }
    }
  }, [router]); 


  return (
    <aside className="w-64 sm:w-55 rounded-t-2xl h-screen relative bg-black border-r border-zinc-800 flex flex-col justify-between p-6 sm:p-2 font-sans select-none">
      
      <div className="flex flex-col gap-6 flex-1 min-h-0 mb-4">
        
        <div className="flex items-center gap-3 px-2 pt-2 shrink-0">
          <span className="text-white font-bold text-xl tracking-wider">
            <h1 className="font-jersey text-[36px] sm:mt-3">
              MARIADB MART
            </h1>
          </span>
        </div>

        <nav className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden py-2.5 pr-1
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-black
          [&::-webkit-scrollbar-thumb]:bg-[#ccff66]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-[#b3ff33]"
        >
          <NavItem href="/martinventory" icon={<LayoutDashboard size={20} />} label="Dashboard"  />
          <NavItem href="/manageitems" icon={<ArrowLeftRight size={20} />} label="Add/Remove Items" />
          <NavItem href="/talk-vendors" icon={<Podcast size={20} />} label="Talk Vendors" />
          <NavItem href="/requests" icon={<Mail size={20} />} label="Requests" />
          <NavItem href="/addcategory" icon={<Mail size={20} />} label="Add Category" />
          <NavItem href="/productmanagement" icon={<Mail size={20} />} label="Manage Products" />
          <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-zinc-800 pt-4 shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-medium">
            AR
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-medium tracking-wide">{userInfo.name}</span>
            <span className="text-zinc-500 text-[10px]">{userInfo.role}</span>
          </div>
        </div>

        <button
          onClick={()=>logout()} 
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
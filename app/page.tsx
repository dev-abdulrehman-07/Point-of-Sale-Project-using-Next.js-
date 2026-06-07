import Image from "next/image";
import { UserRound } from "lucide-react";
import ProductComponent from "@/POS-interface-Components/ProductComponent";
import BillComponent from "@/POS-interface-Components/BillComponent";
import SideBar from "@/POS-interface-Components/sideBar";

export default function Home() {
  return (
    <div className=" bg-black grid grid-cols-16">
      <div className="relative  col-span-1">
        <div className="sticky top-2">

        <SideBar/>
        </div>
      </div>

      <div className="min-h-screen pb-3 bg-white rounded-l-4xl rounded-b-none col-span-10">



        <div className="w-full xl:h-[78px] grid  grid-cols-2   ">
          <div className="xl:pl-[52px]  flex items-center ">
            <h1 className="font-jersey xl:text-[42px]">CREATE ORDER</h1>
          </div>

          <div className="flex h-full justify-end pr-10 ">
            <div className="flex justify-center items-center gap-x-2   ">
              <div className="h-8 w-8 rounded-full border p-1.5 flex justify-center items-center  ">
                <UserRound />
              </div>
              <div className="flex justify-center flex-col relative  ">
                <h1 className="text-[14px]">Abdul Rehman</h1>
                <div className="flex  items-center gap-x-1">
                  <p className="text-[10px]">Counter</p>
                              <div className="h-2 w-2 bg-[#ccff66]  animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>











        
          <div className="col-span-9"> 

          <ProductComponent />
           </div>
          
      




        
      </div>
      <div className="col-span-5 relative">
        <div className="sticky top-0">
          <BillComponent />

        </div>

          </div>

    </div>
  );
}

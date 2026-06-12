import { UserRound } from "lucide-react";
import ProductComponent from "@/components/POS-interface-Components/ProductComponent";
import BillComponent from "@/components/POS-interface-Components/BillComponent";
import UserprofileComp from "@/components/POS-interface-Components/userprofileComp";

export default function Home() {
  return (
    <div className="bg-black grid grid-cols-1 lg:grid-cols-15 min-h-screen w-full">
      
      <main className="min-h-screen pb-3 bg-white rounded-t-4xl lg:rounded-l-4xl lg:rounded-tr-none col-span-1 lg:col-span-10">
        
        <header className="w-full h-auto py-4 lg:py-0 lg:h-[78px] flex justify-between items-center px-4 md:px-8 lg:grid lg:grid-cols-2">
          <div className="lg:pl-[52px] flex items-center">
            <h1 className="font-jersey text-2xl sm:text-3xl lg:text-[42px]">CREATE ORDER</h1>
          </div>

          <div className="flex h-full justify-end lg:pr-10">
            <div className="flex justify-center items-center gap-x-2">
              <div className="h-8 w-8 rounded-full border p-1.5 flex justify-center items-center">
                <UserRound className="w-4 h-4" />
              </div>
              <UserprofileComp />
            </div>
          </div>
        </header>
    
        <section className="w-full">
          <ProductComponent />
        </section>
      </main>
      <aside className="col-span-1 lg:col-span-5 relative bg-black">
        <div className="lg:sticky lg:top-0 w-full">
          <BillComponent />
        </div>
      </aside>

    </div>
  );
}
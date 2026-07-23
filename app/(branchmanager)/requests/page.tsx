
import {  RotateCcw, PackagePlus, User, Mailbox, Search } from "lucide-react";
import Requestcomp from "@/components/martinventory-Comp/requestcomp";
  
export default function InventoryRequestPage() {

  return (
    <div className="mt-6 p-5 max-w-7xl mx-auto">
 
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `#ccff661a`, color: `#ccff66` }}
          >
            <PackagePlus size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Requests Management
            </h1>
            <p className="text-sm text-gray-500">
              Complete, Reject or Return Stock requests.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Requestcomp/>
      </div>
    </div>
  );
}
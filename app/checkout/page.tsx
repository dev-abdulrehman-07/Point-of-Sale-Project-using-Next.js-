import CustomerForm from "@/components/POS-interface-Components/afterProcessStepComp/customerForm";
import PaymentSelection from "@/components/POS-interface-Components/PaymentSelection";
import Stepper from "@/components/POS-interface-Components/Steper";
import React from "react";

function page() {
  const steps = [
    { value: 1, name: "Parcel/Table" },
    { value: 2, name: "Information" },
    { value: 3, name: "Confirm Payment" },
  ];
  return (
    <div className="h-screen p-1">
      <div className="h-full w-full bg-white rounded-2xl border">
        <CustomerForm/>
      </div>
    </div>
  );
}

export default page;

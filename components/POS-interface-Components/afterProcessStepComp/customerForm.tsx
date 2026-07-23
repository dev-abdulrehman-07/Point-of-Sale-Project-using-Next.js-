

"use client"
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleFadingArrowUp, Coins, CreditCard, Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { addToOrder, decreaseQuantity, removeFromOrder } from "@/lib/store/Slices/posSlice";

function CustomerForm() {
  const data = useAppSelector(state => state.pos);
  const dispatch = useAppDispatch();
  
  const [PaymentMethods, setPaymentMethods] = useState<boolean>(false);
  const [OrderType, setOrderType] = useState<boolean>(false);
  const [showTable, setshowTable] = useState<boolean>(false);
  const [ChoosedOrderType, setChoosedOrderType] = useState<string>("");
  const [ChoosedShowTableType, setChoosedShowTable] = useState<number>(0);
  const [ChoosedMethod, setChoosedMethod] = useState<string>("");
  const [customerPaid, setCustomerPaid] = useState<number>(0);
  
  const tables = Array.from({ length: 25 }, (_, index) => index + 1);

  const subtotal = data.totalsOfOrder?.subtotal || 0;
  const gst = data.totalsOfOrder?.gst || 0;
  const total = data.totalsOfOrder?.total || 0;
  const changeDue = customerPaid > 0 ? customerPaid - total : 0;

  return (
    <div className="max-w-full h-full mx-auto p-6 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      
      {/* Top Fields Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Customer Name input */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="customerName">
            Customer Name
          </label>
          <input
            className="w-full border border-slate-200 bg-white text-slate-800 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            type="text"
            name="customerName"
            id="customerName"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Payment Method Selector */}
        <div className="flex flex-col space-y-1.5 relative">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Payment Method
          </label>
          <button
            type="button"
            onClick={() => setPaymentMethods(p => !p)}
            className="w-full text-left border border-slate-200 bg-white text-slate-800 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm flex justify-between items-center"
          >
            <span className={ChoosedMethod ? "text-slate-800" : "text-slate-400"}>
              {ChoosedMethod || "Choose Payment Method"}
            </span>
            {ChoosedMethod === "Cash" && <Coins size={16} className="text-emerald-500" />}
            {ChoosedMethod === "Card" && <CreditCard size={16} className="text-blue-500" />}
          </button>

          <AnimatePresence>
            {PaymentMethods && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full flex flex-col p-1.5 mt-2 absolute top-full left-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 gap-1"
              >
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethods(false);
                    setChoosedMethod("Cash");
                  }}
                  className="p-2.5 flex justify-between items-center rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Cash</span>
                  <Coins size={16} className="text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethods(false);
                    setChoosedMethod("Card");
                  }}
                  className="p-2.5 flex justify-between items-center rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Card</span>
                  <CreditCard size={16} className="text-slate-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Type Selector */}
        <div className="flex flex-col space-y-1.5 relative">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Order Type
          </label>
          <button
            type="button"
            onClick={() => setOrderType(p => !p)}
            className="w-full text-left border border-slate-200 bg-white text-slate-800 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm flex justify-between items-center"
          >
            <span className={ChoosedOrderType ? "text-slate-800" : "text-slate-400"}>
              {ChoosedOrderType || "Choose Type"}
            </span>
            {ChoosedOrderType === "Dine-in" && <UtensilsCrossed size={16} className="text-amber-500" />}
          </button>

          <AnimatePresence>
            {OrderType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full flex flex-col p-1.5 mt-2 absolute top-full left-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 gap-1"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOrderType(false);
                    setChoosedOrderType("Takeaway");
                  }}
                  className="p-2.5 flex justify-between items-center rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Takeaway</span>
                  <span className="text-slate-400 text-xs">🎒</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderType(false);
                    setChoosedOrderType("Dine-in");
                  }}
                  className="p-2.5 flex justify-between items-center rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Dine-in</span>
                  <UtensilsCrossed size={14} className="text-slate-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Table Selector */}
        {ChoosedOrderType === "Dine-in" && (
          <div className="flex flex-col space-y-1.5 relative md:col-span-3">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Assign Table
            </label>
            <button
              type="button"
              onClick={() => setshowTable(p => !p)}
              className="w-full md:w-72 text-left border border-slate-200 bg-white text-slate-800 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            >
              <span className={ChoosedShowTableType !== 0 ? "text-slate-800" : "text-slate-400"}>
                {ChoosedShowTableType === 0 ? "Select Table Number" : `Table ${ChoosedShowTableType}`}
              </span>
            </button>

            <AnimatePresence>
              {showTable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 flex flex-wrap gap-2 p-3 bg-white max-w-sm border border-slate-100 rounded-2xl shadow-2xl z-50"
                >
                  {tables.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setChoosedShowTable(i + 1);
                        setshowTable(false);
                      }}
                      className={`h-9 w-9 rounded-xl border flex justify-center items-center text-xs font-semibold transition-all ${
                        ChoosedShowTableType === i + 1
                          ? "bg-emerald-500 border-transparent text-white shadow-sm shadow-emerald-500/20"
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Dynamic Payment Info */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl min-h-[220px] flex flex-col justify-center">
          {ChoosedMethod === "" && (
            <div className="text-slate-300 flex flex-col items-center justify-center space-y-2 text-center py-6">
              <CircleFadingArrowUp size={32} className="stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-400">Please select a payment method above</p>
            </div>
          )}

          {ChoosedMethod === "Cash" && (
            <div className="space-y-4 w-full animate-fadeIn">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="cashPaid">
                  Customer Cash Given
                </label>
                <input
                  id="cashPaid"
                  className="w-full border border-slate-200 bg-white text-slate-800 rounded-xl p-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  type="number"
                  onChange={(e) => setCustomerPaid(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Change Due back</span>
                <span className={`text-lg font-bold ${changeDue >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  Rs. {changeDue.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {ChoosedMethod === "Card" && (
            <div className="text-center py-6 space-y-2">
              <span className="p-3 bg-blue-50 text-blue-500 rounded-2xl inline-block">
                <CreditCard size={24} />
              </span>
              <p className="text-sm font-semibold text-slate-700">Card Payment Selected</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Swipe or tap the card on the terminal to capture payment on checkout.</p>
            </div>
          )}
        </div>

        {/* Right Side: Order Items List */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 max-h-[320px] overflow-y-auto space-y-3 custom-scrollbar">
          {data.order.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-medium">
              🛒 No items added to order yet
            </div>
          ) : (
            data.order.map((item) => (
              <div
                key={item._id as string}
                className="flex items-center justify-between p-3 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-200 transition-all"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-semibold text-sm text-slate-800 truncate">{item.title}</span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5">
                    Rs. {item.price.toLocaleString()} each
                  </span>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => dispatch(decreaseQuantity(item._id as string))}
                      className="text-slate-500 hover:bg-slate-50 rounded p-1 transition"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="px-2.5 font-bold text-xs text-slate-800 min-w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => dispatch(addToOrder(item))}
                      className="text-slate-500 hover:bg-slate-50 rounded p-1 transition"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>

                  <span className="font-bold text-slate-800 text-sm min-w-[70px] text-right">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>

                  <button
                    type="button"
                    onClick={() => dispatch(removeFromOrder(item._id as string))}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Sticky-feel Invoice Summary Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-2.5 pb-4 border-b border-dashed border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="font-semibold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">GST (18%)</span>
            <span className="font-semibold text-slate-800">Rs. {gst.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Amount
            </p>
            <p className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              Rs. {total.toLocaleString()}
            </p>
          </div>

          <button 
            type="submit" 
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-slate-900/10 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0"
          >
            Complete Order & Pay
          </button>
        </div>
      </div>

    </div>
  );
}

export default CustomerForm;
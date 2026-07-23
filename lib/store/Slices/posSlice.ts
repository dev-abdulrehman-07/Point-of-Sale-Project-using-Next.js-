import { cardDataType } from "@/model/product.Model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface  {
//   id: number;
//   image?: string;
//   title: string;
//   description: string;
//   isActive: boolean;
//   price: number;
//   quantity: number;
// }

interface totalsOfOrder  {
  subtotal : number ,
gst : number,
total : number,
}

interface POSState {
  order: Omit<cardDataType, "Recipe">[];
  totalsOfOrder : totalsOfOrder ,
  activeEmployee: { id: number; name: string } | null;
}

const initialState: POSState = {
  order: [],
  totalsOfOrder :{
    subtotal: 0,
    gst : 0,
    total: 0,

  },
  activeEmployee: null,
};

export const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {


    hydrateOrder: (state, action: PayloadAction<Omit<cardDataType, "Recipe">[]>) => {
      state.order = action.payload;
    },
    totalhydrateOrder: (state, action: PayloadAction<totalsOfOrder>) => {
      state.totalsOfOrder = action.payload;
    },

    

  

removeFromOrder: (state, action: PayloadAction<string>) => {
  const productId = action.payload;
  state.order = state.order.filter((item) => item._id !== productId);
},


    addToOrder: (state, action: PayloadAction<Omit<cardDataType, "Recipe">>) => {
      const product = action.payload;

      const existingItem = state.order.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.order.push({ ...product, quantity: 1 });
      }
    },
    setActiveEmployee: (
      state,
      action: PayloadAction<{ id: number; name: string } | null>,
    ) => {
      state.activeEmployee = action.payload;
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.order.find((item) => item._id === productId);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.order = state.order.filter((item) => item._id !== productId);
        }
      }
    },
    
    clearPOS: (state) => {
      state.order = [];
      state.activeEmployee = null;
    },
    calulatetotals : (state , payload : PayloadAction<totalsOfOrder> )=>{
      state.totalsOfOrder.gst = payload.payload.gst
      state.totalsOfOrder.subtotal = payload.payload.subtotal
      state.totalsOfOrder.total = payload.payload.total
    }
  },
});

export const { addToOrder, setActiveEmployee, decreaseQuantity, clearPOS,removeFromOrder,hydrateOrder ,calulatetotals,totalhydrateOrder} =
  posSlice.actions;
export default posSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductType {
  id: number;
  image?: string;
  title: string;
  description: string;

  isActive: boolean;
  price: number;
  quantity: number;
}

interface POSState {
  order: ProductType[];
  activeEmployee: { id: number; name: string } | null;
}

const initialState: POSState = {
  order: [],
  activeEmployee: null,
};

export const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    // Yeh naya action add karein refresh ke baad data wapas laane ke liye
    hydrateOrder: (state, action: PayloadAction<ProductType[]>) => {
      state.order = action.payload;
    },
    // posSlice.ts ke reducers mein yeh add karein:
removeFromOrder: (state, action: PayloadAction<number>) => {
  const productId = action.payload;
  // Direct item ko array se urha do
  state.order = state.order.filter((item) => item.id !== productId);
},
    addToOrder: (state, action: PayloadAction<ProductType>) => {
      const product = action.payload;

      const existingItem = state.order.find((item) => item.id === product.id);

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
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const item = state.order.find((item) => item.id === productId);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.order = state.order.filter((item) => item.id !== productId);
        }
      }
    },
    clearPOS: (state) => {
      state.order = [];
      state.activeEmployee = null;
    },
  },
});

export const { addToOrder, setActiveEmployee, decreaseQuantity, clearPOS,removeFromOrder,hydrateOrder } =
  posSlice.actions;
export default posSlice.reducer;

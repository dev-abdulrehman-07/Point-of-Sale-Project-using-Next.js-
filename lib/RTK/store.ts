
import { useDispatch, useSelector, useStore } from "react-redux";
import  posSlice  from "./posSlice";

// store/store.ts
import { configureStore, Middleware } from "@reduxjs/toolkit";
import posReducer from "./posSlice";

// Custom Middleware jo har action ke baad state ko local storage mein save karega
const localStorageMiddleware: Middleware = (storeInstance) => (next) => (action) => {
  const result = next(action); // Action ko chalne do
  
  // Action chalne ke baad nayi state nikalen
  const state = storeInstance.getState();
  
  if (typeof window !== "undefined") {
    // Sirf pos slice ka order save karein
    localStorage.setItem("pos_order", JSON.stringify(state.pos.order));
  }
  
  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      pos: posReducer,
    },
    // Middleware ko store mein register karein
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  });
};

// Types define karein jo pure app mein use hongi
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// TypeScript Hooks export karein taake baar-baar types na likhni paren
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected) => useSelector(selector);
export const useAppStore = () => useStore<AppStore>();
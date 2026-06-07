import { useDispatch, useSelector, useStore } from "react-redux";
import posSlice from "./posSlice";
import { configureStore, Middleware } from "@reduxjs/toolkit";
import { mainApi } from "@/frontend Api/main.api";
import posReducer from "./posSlice";
const localStorageMiddleware: Middleware =
  (storeInstance) => (next) => (action) => {
    const result = next(action);
    const state = storeInstance.getState();
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_order", JSON.stringify(state.pos.order));
    }
    return result;
  };
export const makeStore = () => {
  return configureStore({
    reducer: {
      pos: posReducer,
      [mainApi.reducerPath]:mainApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware).concat(mainApi.middleware),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected,
) => useSelector(selector);
export const useAppStore = () => useStore<AppStore>();

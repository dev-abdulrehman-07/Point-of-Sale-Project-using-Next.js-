import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  InventoryActionPayload,
  InventoryApiResponse,
  InventoryItemResponse,
} from "@/app/api/inventory/route";
import { iEmployee } from "@/model/Employee.Model";
import type { cardDataType } from "@/model/product.Model";
import { CategoriesResponse } from "@/app/api/categories/route";
import { getproductApiResponse } from "@/app/api/addProduct/route";

export enum AppRoles {
  BRANCH_MANAGER = "Branch Manager",
  INVENTORY_MANAGER = "Inventory Manager",
  INVENTORY_STAFF = "Inventory Staff",
  CASHIER = "Cashier",
  CHEF = "Chef",
  COOKING_STAFF = "Cooking Staff",
  CLEANING_STAFF = "Cleaning Staff",
  WAITER = "Waiter",
  GUARD = "Guard"
}

export interface loginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: iEmployee["role"];
  };
}

export interface accActivation_request {
  password: string;
  confirmpassword: string;
}

export interface AddEmployeeResponse {
  message: string;
}

export interface RequestsApiResponse {
  data: Requests[];
}

export type Requests = {
  _id: string;
  from: { _id: string; fullname: string; role: string };
  to: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export const mainApi = createApi({
  reducerPath: "mainApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["getemployee", "inventory", "getrequests", "categories","getProduct"],
  endpoints: (builder) => ({
    getemployee: builder.query<any[], void>({
      query: () => "/getemployee",
      providesTags: ["getemployee"],
    }),

    addemployee: builder.mutation<AddEmployeeResponse, any>({
      query: (newEmployee) => ({
        url: "/addemployee",
        method: 'POST',
        body: newEmployee,
      }),
      invalidatesTags: ["getemployee"]
    }),

    login: builder.mutation<LoginResponse, loginRequest>({
      query: (loginData) => ({
        url: "/userLogin",
        method: 'POST',
        body: loginData
      })
    }),

    accActivation: builder.mutation<LoginResponse, accActivation_request>({
      query: (sendData) => ({
        url: "/accountactivation",
        method: 'POST',
        body: sendData
      })
    }),

    getInventoryItems: builder.query<InventoryItemResponse[], void>({
      query: () => "/inventory",
      transformResponse: (response: InventoryApiResponse) =>
        (response.data as InventoryItemResponse[]) ?? [],
      providesTags: ["inventory"],
    }),

    inventoryAction: builder.mutation<InventoryApiResponse, InventoryActionPayload>({
      query: (body) => ({
        url: "/inventory",
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory"],
    }),

    getrequests: builder.query<Requests[], void>({
      query: () => "/request",
      providesTags: ["getrequests"],
    }),

    createProduct: builder.mutation<any, Partial<cardDataType>>({
      query: (product: Partial<cardDataType>) => ({
        url: "/addProduct",
        method: "POST",
        body: product
      }),
      invalidatesTags: ["inventory"],
    }),

    getcategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: ["categories"],
    }),
    getproduct: builder.query<getproductApiResponse, void>({
      query: () => "/addProduct",
      providesTags: ["getProduct"],
    }),
  }),
});

export const {
  useAddemployeeMutation,
  useGetemployeeQuery,
  useLoginMutation,
  useAccActivationMutation,
  useGetInventoryItemsQuery,
  useInventoryActionMutation,
  useGetrequestsQuery,
  useCreateProductMutation,
  useGetcategoriesQuery, 
  useGetproductQuery
} = mainApi;
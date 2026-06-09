import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { body } from "motion/react-client";


export interface loginRequest {
email : string,
password : string
}
export interface LoginResponse {
  success: boolean;
  message : string;
  user?: {
    id: string;
    name : string;
    email: string;
    role: string;
  };
}



export const mainApi = createApi({
  reducerPath: "mainApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["getemployee"],
  endpoints: (builder) => ({
    getemployee: builder.query<any[], void>({
      query: () => "/getemployee",
      providesTags: ["getemployee"],
    }),

    addemployee: builder.mutation<any[], any>({
      query: (newEmployee) => ({
        url: "/addemployee",
        method : 'POST',
        body: newEmployee,
      }),
      invalidatesTags: ["getemployee"],
    }),



    login : builder.mutation<LoginResponse,loginRequest>({
      query : (loginData)=>({
        url : "/login",
        method : 'POST',
        body : loginData
      })
    })






  }),
});

export const { useAddemployeeMutation, useGetemployeeQuery,useLoginMutation } = mainApi;

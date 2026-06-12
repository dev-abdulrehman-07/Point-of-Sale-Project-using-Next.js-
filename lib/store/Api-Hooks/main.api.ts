import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


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
    role: "admin" | "employee" | "Shef" | "invertrymanager" ;
  };
}
export interface accActivation_request {
  password : string ,
  confirmpassword : string

}

export interface AddEmployeeResponse {
  message: string;
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

    addemployee: builder.mutation<AddEmployeeResponse, any>({
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
    }),


    accActivation : builder.mutation<LoginResponse,accActivation_request>({
query : (sendData)=>({
url : "/accountactivation",
method : 'POST',
body : sendData
})




    }) 






  }),
});

export const { useAddemployeeMutation, useGetemployeeQuery,useLoginMutation,useAccActivationMutation } = mainApi;

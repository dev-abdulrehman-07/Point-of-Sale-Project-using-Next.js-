import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const mainApi =createApi({
reducerPath :"mainApi",
baseQuery : fetchBaseQuery({baseUrl:'/api'}),
tagTypes : ['getemployee'],
endpoints : (builder)=>({


    getemployee : builder.query<any[],void>({
        query :()=> '/getemployee',
        providesTags : ['getemployee'],
    }),


    addemployee : builder.mutation<any[],void>({
        query : (newEmployee)=>({
            url :'/addemployee',
            body : newEmployee
        }),
        invalidatesTags :['getemployee']
    })






















})
}
)

export const {useAddemployeeMutation,useGetemployeeQuery} = mainApi

import React from 'react'
import { NextResponse } from 'next/server'
import { loginRequest, LoginResponse } from '@/lib/store/Api-Hooks/main.api'
import { Employee, iEmployee } from '@/model/Employee.Model';

export default async function POST(request:Request) {


    const body : loginRequest = await request.json();

    const JWTsecretkey = process.env.JWT_SECRET || "";

    if(JWTsecretkey) throw new Error('Please Provide SecretKey');

    if(!body.email || !body.password ){
return NextResponse.json<LoginResponse>({
    success : false,
    message : "Please Enter Email And Password Correctly"
})
    }


    const checkemail : iEmployee | null = await Employee.findOne({
        email : body.email
    })

    if(!checkemail){
        return NextResponse.json<LoginResponse>({
            success : false,
            message : "Incorrect Email Or Password"
        })
    }

    if(checkemail.password === body.password){
        return NextResponse.redirect("/Welcome")

    }





















  
}


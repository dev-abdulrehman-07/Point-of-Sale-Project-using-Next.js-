import React from "react";
import { NextResponse } from "next/server";
import { loginRequest, LoginResponse } from "@/lib/store/Api-Hooks/main.api";
import { Employee, iEmployee } from "@/model/Employee.Model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/database/dbConnection";



export async function POST(request: Request) {

  try {
    await dbConnection()
    const cookieStore = await cookies();
    const body: loginRequest = await request.json();

    const JWTsecretkey = process.env.JWT_SECRET || "";


    if (!JWTsecretkey) {
      throw new Error("Please Provide SecretKey");
    }

    if (!body.email || !body.password) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Please Enter Email And Password Correctly",
      });
    }

    const checkemail: iEmployee | null = await Employee.findOne({
      email: body.email,
    });

    if (!checkemail) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Incorrect Email Or Password",
      });
    }

    if(checkemail.email === checkemail.password){
  if(body.email===body.password){
    const payload = {email : body.email}
    const option = {expiresIn : "1d" as const}
const token = await jwt.sign(payload,JWTsecretkey,option);

cookieStore.set({
  name: "newplayer",
  value: token,
  maxAge: 60 * 60 * 24,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/"
}); 


return NextResponse.json<LoginResponse>({
  message:"/newplayer",
  success : true,
  user: {
    id: checkemail._id.toString(), 
    email: checkemail.email,
    name: checkemail.fullname,
    role: checkemail.role,
  }  
})



  } 
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      checkemail.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Please Enter Correct Password",
      });
    }

    const payload = { 
      id: checkemail._id.toString(), 
      email: checkemail.email,
      name: checkemail.fullname,
      role: checkemail.role, 
    };
    const options = { expiresIn: "1h" as const }; 

    const firstlogincookie = jwt.sign(payload, JWTsecretkey, options);

    cookieStore.set({
      name: "velvetTokken",
      value: firstlogincookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });

    
  
    return NextResponse.json<LoginResponse>({
      success: true,
      message: "Congratulations",
      user: {
        id: checkemail._id.toString(), 
        email: checkemail.email,
        name: checkemail.fullname,
        role: checkemail.role,
      }

    });  
    

  } catch (error) {
    if (error instanceof Error) {
        console.log(error.message)
      return NextResponse.json<LoginResponse>({
        message: `${error.message}`,
        success: false,
      });
    } else {
        console.log(error)
      return NextResponse.json<LoginResponse>({
        message: `${error}`,
        success: false,
      });
    }
  }
}
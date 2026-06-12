import React from "react";
import { NextResponse } from "next/server";
import { LoginResponse, accActivation_request } from "@/lib/store/Api-Hooks/main.api";
import { Employee } from "@/model/Employee.Model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/database/dbConnection";

interface JwtPayload {
  email: string;
}

export async function POST(request: Request) {
  try {
    await dbConnection();
    const cookieStore = await cookies();
    const body: accActivation_request = await request.json();

    const JWTsecretkey = process.env.JWT_SECRET || "";

    if (!JWTsecretkey) {
      throw new Error("Please Provide SecretKey");
    }

    const isPasswordSame = body.confirmpassword === body.password;
    if (!isPasswordSame) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Password And Confirm Password are not same",
      });
    }

    const tokenCheck = cookieStore.get("newplayer")?.value;
    if (!tokenCheck) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Session expired or invalid token. Please try again.",
      });
    }

    const decoded = jwt.verify(tokenCheck, JWTsecretkey) as JwtPayload;
    
    if (!decoded || !decoded.email) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Invalid token payload.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const updatedEmployee = await Employee.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Employee account not found.",
      });
    }

    cookieStore.delete("newplayer");

    return NextResponse.json<LoginResponse>({
      success: true,
      message: "/",
    });

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return NextResponse.json<LoginResponse>({
        message: `${error.message}`,
        success: false,
      });
    } else {
      console.log(error);
      return NextResponse.json<LoginResponse>({
        message: `${error}`,
        success: false,
      });
    }
  }
}
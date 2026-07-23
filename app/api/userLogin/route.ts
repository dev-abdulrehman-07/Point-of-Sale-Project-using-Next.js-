import { NextResponse } from "next/server";
import { loginRequest, LoginResponse } from "@/lib/store/Api-Hooks/main.api";
import { Employee, iEmployee } from "@/model/Employee.Model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/database/dbConnection";

export async function POST(request: Request) {
  try {
    await dbConnection();
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

    const employee: iEmployee | null = await Employee.findOne({
      email: body.email,
    });

    if (!employee) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Incorrect Email Or Password",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      employee.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json<LoginResponse>({
        success: false,
        message: "Please Enter Correct Password",
      });
    }
    if (body.email === body.password) {
      const payload = { email: body.email };
      const option = { expiresIn: "1d" as const };
      const token = jwt.sign(payload, JWTsecretkey, option);

      cookieStore.set({
        name: "newplayer",
        value: token,
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return NextResponse.json<LoginResponse>({
        message: "/newplayer",
        success: true,
        user: {
          id: employee._id.toString(),
          email: employee.email,
          name: employee.fullname,
          role: employee.role,
        },
      });
    }

    const payload = {
      id: employee._id.toString(),
      email: employee.email,
      name: employee.fullname,
      role: employee.role,
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
      path: "/",
    });

    return NextResponse.json<LoginResponse>({
      success: true,
      message: "Congratulations",
      user: {
        id: employee._id.toString(),
        email: employee.email,
        name: employee.fullname,
        role: employee.role,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Login Error: ", errorMessage);

    return NextResponse.json<LoginResponse>({
      message: errorMessage,
      success: false,
    });
  }
}

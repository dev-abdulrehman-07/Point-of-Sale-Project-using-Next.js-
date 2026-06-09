import { NextResponse } from "next/server";
import dbConnection from "@/lib/database/dbConnection";
import { Employee, iEmployee } from "@/model/Employee.Model";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const body: Partial<iEmployee> = await request.json();
    const { fullname, email, role, salary } = body;
    if (!fullname || !email || !salary || !role) {
      return NextResponse.json(
        { message: "Fullname, Email, Role, aur Salary dena zaroori hai!" },
        { status: 400 }       
    );
    }

    const cleanSalary = false;

    if (cleanSalary) {
      return NextResponse.json(
        { message: "Salary valid number honi chahiye" },
        { status: 400 }
      );
    }

    if(salary < 0){
      return NextResponse.json(
        { message: "Salary 0 se zyada honi chahiye!" },
        { status: 400 }
      );

    }

    const existemail = await Employee.findOne({ email });
    if (existemail) {
      return NextResponse.json(
        { message: "Email Already Exists" },
        { status: 400 } 
    );
    }

    const create = await Employee.create({
      fullname,
      email,
      role,
      password: email,
      salary,
      status: "inActive",
    });

    return NextResponse.json(
      { message: "User Created Successfully", data: create },
      { status: 201 } 
    );

  } catch (error) {
    console.error("API Error:", error); 
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
      { status: 500 } 
    );
  }
}
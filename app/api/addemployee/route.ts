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
               
    );
    }

    const cleanSalary = false;

    if (cleanSalary) {
      return NextResponse.json(
        { message: "Salary valid number honi chahiye" },
       
      );
    }

    if(salary < 0){
      return NextResponse.json(
        { message: "Salary 0 se zyada honi chahiye!" },
    
      );

    }

    const existemail = await Employee.findOne({ email });
    if (existemail) {
      return NextResponse.json(
        { message: "Email Already Exists" },
      
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
    
    );

  } catch (error) {
    console.error("API Error:", error); 
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
     
    );
  }
}
import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import { Employee, iEmployee } from "@/model/Employee.Model";


export async function POST(request:Request) {
try {
    await dbConnection();
    const body : Partial<iEmployee> = await request.json()
const {fullname ,email ,role ,salary} = body;


if(!fullname|| !email || !salary || !role){
    return NextResponse.json(
        { message: "Fullname, Email, aur Salary dena zaroori hai!" },
        { status: 400 }
    )
}

if(salary < 0 ){
    return NextResponse.json({
        message : "Salary Must more than 0"
    })
}


const existemail = await Employee.findOne({email});
if(existemail) {
    return NextResponse.json({
        message : "Email Already Exist"
    })
}


const create = await Employee.create({
    fullname,
    email,
    role,
    password : email,
    salary,
    status : "inActive"

    
})

return NextResponse.json({
    message :"User Created Successfully"
})
} catch (error) {
    if(error instanceof Error){
        return NextResponse.json({
            message :`${error.message}`
        })
    
    }else{
        return NextResponse.json({
            message :`${error}`
        })
        
    }
}





    
}
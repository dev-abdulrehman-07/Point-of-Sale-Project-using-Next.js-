import dbConnection from "@/lib/database/dbConnection";
import { NextResponse } from "next/server";
import Requests from "@/model/Requests.Model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function POST(req: Request) {
  await dbConnection();

  try {
    const body = await req.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 }); 
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("velvetTokken");

    if (!token) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    const verifytoken = jwt.verify(token.value, process.env.JWT_SECRET!) as JwtPayload;

    if (!verifytoken || !verifytoken.id) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    const request = await Requests.create({
      from: verifytoken.id, 
      to,
      subject,
      message,
    });

    return NextResponse.json({ request }, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong" }, 
      { status: 401 }
    );
  }
}

export async function GET() {
  await dbConnection();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("velvetTokken");

    if (!token) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    const verifytoken = jwt.verify(token.value, process.env.JWT_SECRET || "") as JwtPayload;

    if (!verifytoken || !verifytoken.id) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    const requests = await Requests.find({ to: verifytoken.id })
      .populate("from", "fullname role"); 

    return NextResponse.json({ requests }, { status: 200 });

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid or expired token" }, 
      { status: 401 }
    );
  }
}
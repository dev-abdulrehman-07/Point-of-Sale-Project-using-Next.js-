import { NextResponse } from "next/server";
import dbConnection from "@/lib/database/dbConnection";

export async function GET() {
  try {
    await dbConnection()
    return NextResponse.json({
      success: true,
      message: "Database Connected Successfully! 🚀🔥",
    });
  } catch (error) {
    
    return NextResponse.json(
      {
        success: false,
        message: "Database Connection Failed! ❌",
        error: error instanceof Error ? error.message : String(error),
      } 
    );
  }
}
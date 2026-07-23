import { NextResponse } from "next/server";
import Category, { ICategories } from "@/model/productCategory.Model";
import { verifySession } from "../inventory/route";
import dbConnection from "@/lib/database/dbConnection";

export async function POST(req: Request) {





  try {


    const verify = await verifySession()
    if (!verify.authorized) {
      return NextResponse.json({ error: verify.message }, { status: verify.status })
    }


    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newCategory = await Category.create({ name, slug });
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export interface CategoriesResponse{
  success:boolean;
  message?:string;
  data : ICategories[] 
}




export async function GET() {
  try {
    await dbConnection()
    const verify = await verifySession()
    if (!verify.authorized) {
      return NextResponse.json({ error: verify.message }, { status: verify.status })
    }
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
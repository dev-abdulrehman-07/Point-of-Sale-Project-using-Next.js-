import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnection from "@/lib/database/dbConnection";
import { cardDataType, Product } from "@/model/product.Model";
import { Item } from "@/model/Item";

export async function POST(req: Request) {
  try {
    await dbConnection();

    const body: Omit<cardDataType, "_id" | "isActive" | "quantity"> =
      await req.json();

    const { title, category, description, price, image, Recipe } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Product name is required." },
        { status: 400 },
      );
    }
    if (
      !description ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Product description is required." },
        { status: 400 },
      );
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { success: false, message: "Valid category ID is required." },
        { status: 400 },
      );
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return NextResponse.json(
        { success: false, message: "Valid price is required." },
        { status: 400 },
      );
    }

    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json(
        { success: false, message: "Image URL is required." },
        { status: 400 },
      );
    }

    if (!Array.isArray(Recipe)) {
      return NextResponse.json(
        { success: false, message: "Recipe must be an array." },
        { status: 400 },
      );
    }

    for (const entry of Recipe) {
      if (!entry.Item || !mongoose.Types.ObjectId.isValid(entry.Item)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid Item ID in recipe: ${entry.Item}`,
          },
          { status: 400 },
        );
      }
      if (
        !entry.Quantity ||
        isNaN(Number(entry.Quantity)) ||
        Number(entry.Quantity) <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each recipe item must have a valid quantity greater than 0.",
          },
          { status: 400 },
        );
      }
    }

    const existingProduct = await Product.findOne({
      title: title.trim(),
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "A product with this name already exists." },
        { status: 409 },
      );
    }

    const newProduct = await Product.create({
      title: title.trim(),
      description: description.trim(),
      category: new mongoose.Types.ObjectId(category),
      price: Number(price),
      image: image.trim(),
      Recipe: Recipe.map((entry) => ({
        Item: new mongoose.Types.ObjectId(entry.Item),
        Quantity: Number(entry.Quantity),
      })),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: newProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/products] Error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}

export interface getproductApiResponse {
  success: boolean;
  data: cardDataType[];
  message: string;
}

export async function GET() {
  try {
    await dbConnection();

    const finalData = await Product.aggregate([
      { $match: { isActive: true } },

      { $unwind: "$Recipe" },

      {
        $lookup: {
          from: "items",
          localField: "Recipe.Item",
          foreignField: "_id",
          as: "ItemDetails",
        },
      },

      { $unwind: "$ItemDetails" },

      {
        $project: {
          title: 1,
          image: 1,
          category: 1,
          description: 1,
          isActive: 1,
          price: 1,
          possibleQuantity: {
            $floor: {
              $divide: ["$ItemDetails.currentStock", "$Recipe.Quantity"],
            },
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          image: { $first: "$image" },
          category: { $first: "$category" },
          description: { $first: "$description" },
          isActive: { $first: "$isActive" },
          price: { $first: "$price" },
          calculatedQty: { $min: "$possibleQuantity" },
        },
      },

      {
        $project: {
          title: 1,
          image: 1,
          category: 1,
          description: 1,
          isActive: 1,
          price: 1,
          quantity: { $ifNull: ["$calculatedQty", 0] },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: finalData,
      message: "Get Data successfully with calculated quantities",
    });
  } catch (error) {
    console.error("Aggregation API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

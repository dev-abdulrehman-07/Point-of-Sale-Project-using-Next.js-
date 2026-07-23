import dbConnection from "@/lib/database/dbConnection";
import { Item } from "@/model/Item";
import { Transaction } from "@/model/Transaction";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export interface InventoryItemResponse {
  _id: string;
  name: string;
  currentStock: number;
  unit: string;
}

export interface InventoryApiResponse {
  success: boolean;
  message: string;
  data?: InventoryItemResponse[] | InventoryItemResponse;
}

export interface AddExistingStockPayload {
  scenario: "add_existing";
  itemId: string;
  quantity: number;
  vendorName?: string;
}

export interface RemoveExistingStockPayload {
  scenario: "remove_existing";
  itemId: string;
  quantity: number;
  reason: string;
}

export interface NewItemPayload {
  scenario: "new_item";
  name: string;
  quantity: number;
  unit: string;
  vendorName: string;
  purchaseNotes?: string;
  amountPaid: number;
}

export type InventoryActionPayload =
  | AddExistingStockPayload
  | RemoveExistingStockPayload
  | NewItemPayload;

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("velvetTokken");

  if (!token) {
    return { authorized: false as const, status: 401, message: "Please login" };
  }

  const secret = process.env.JWT_SECRET || "nothing";

  try {
    jwt.verify(token.value, secret);
    return { authorized: true as const };
  } catch {
    return {
      authorized: false as const,
      status: 401,
      message: "Invalid or expired session. Please login again.",
    };
  }
}

function serializeItem(item: {
  _id: mongoose.Types.ObjectId;
  name: string;
  currentStock: number;
  unit?: string;
}): InventoryItemResponse {
  return {
    _id: item._id.toString(),
    name: item.name,
    currentStock: item.currentStock,
    unit: item.unit || "Units",
  };
}

export async function GET() {
  try {
    const session = await verifySession();
    if (!session.authorized) {
      return NextResponse.json<InventoryApiResponse>(
        { success: false, message: session.message },
        { status: session.status },
      );
    }

    await dbConnection();

    const items = await Item.find().sort({ name: 1 }).lean();

    return NextResponse.json<InventoryApiResponse>({
      success: true,
      message: "Items fetched successfully",
      data: items.map((item) =>
        serializeItem({
          _id: item._id as mongoose.Types.ObjectId,
          name: item.name,
          currentStock: item.currentStock,
          unit: item.unit,
        }),
      ),
    });
  } catch (error) {
    console.error("Inventory GET error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json<InventoryApiResponse>(
      { success: false, message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const dbSession = await mongoose.startSession();

  try {
    const auth = await verifySession();
    if (!auth.authorized) {
      return NextResponse.json<InventoryApiResponse>(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    await dbConnection();

    const body: InventoryActionPayload = await request.json();

    if (!body?.scenario) {
      return NextResponse.json<InventoryApiResponse>(
        { success: false, message: "Invalid request payload" },
        { status: 400 },
      );
    }

    let resultItem: InventoryItemResponse | null = null;

    await dbSession.withTransaction(async () => {
      if (body.scenario === "add_existing") {
        const { itemId, quantity, vendorName } = body;

        if (!itemId || !quantity || quantity <= 0) {
          throw new Error("Valid item and quantity are required");
        }

        const item = await Item.findById(itemId).session(dbSession);
        if (!item) {
          throw new Error("Item not found");
        }

        item.currentStock += quantity;
        await item.save({ session: dbSession });

        await Transaction.create(
          [
            {
              itemId: item._id,
              type: "ADD",
              quantity,
              vendorName: vendorName?.trim() || undefined,
            },
          ],
          { session: dbSession },
        );

        resultItem = serializeItem({
          _id: item._id as mongoose.Types.ObjectId,
          name: item.name,
          currentStock: item.currentStock,
          unit: item.unit,
        });
        return;
      }

      if (body.scenario === "remove_existing") {
        const { itemId, quantity, reason } = body;

        if (!itemId || !quantity || quantity <= 0) {
          throw new Error("Valid item and quantity are required");
        }

        if (!reason?.trim()) {
          throw new Error("Reason for removal is required");
        }

        const item = await Item.findById(itemId).session(dbSession);
        if (!item) {
          throw new Error("Item not found");
        }

        if (item.currentStock < quantity) {
          throw new Error(
            `Insufficient stock. Only ${item.currentStock} unit(s) available.`,
          );
        }

        item.currentStock -= quantity;
        await item.save({ session: dbSession });

        await Transaction.create(
          [
            {
              itemId: item._id,
              type: "REMOVE",
              quantity,
              reason: reason.trim(),
            },
          ],
          { session: dbSession },
        );

        resultItem = serializeItem({
          _id: item._id as mongoose.Types.ObjectId,
          name: item.name,
          currentStock: item.currentStock,
          unit: item.unit,
        });
        return;
      }

      if (body.scenario === "new_item") {
        const { name, quantity, unit, vendorName, purchaseNotes, amountPaid } = body;

        if (!name?.trim()) {
          throw new Error("New item name is required");
        }

        if (!vendorName?.trim()) {
          throw new Error("Vendor name is required");
        }

        if (!quantity || quantity <= 0) {
          throw new Error("Valid quantity is required");
        }

        if (amountPaid === undefined || amountPaid === null || amountPaid < 0) {
          throw new Error("Valid amount paid is required");
        }

        const existing = await Item.findOne({
          name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        }).session(dbSession);

        if (existing) {
          throw new Error("An item with this name already exists");
        }

        const [createdItem] = await Item.create(
          [
            {
              name: name.trim(),
              currentStock: quantity,
              unit: unit || "Units",
            },
          ],
          { session: dbSession },
        );

        await Transaction.create(
          [
            {
              itemId: createdItem._id,
              type: "ADD",
              quantity,
              vendorName: vendorName.trim(),
              reason: purchaseNotes?.trim() || undefined,
              amountPaid,
            },
          ],
          { session: dbSession },
        );

        resultItem = serializeItem({
          _id: createdItem._id as mongoose.Types.ObjectId,
          name: createdItem.name,
          currentStock: createdItem.currentStock,
          unit: createdItem.unit,
        });
      }
    });

    if (!resultItem) {
      return NextResponse.json<InventoryApiResponse>(
        { success: false, message: "Unable to process inventory action" },
        { status: 400 },
      );
    }

    return NextResponse.json<InventoryApiResponse>(
      {
        success: true,
        message: "Inventory updated successfully",
        data: resultItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Inventory POST error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status =
      message.includes("Insufficient") ||
      message.includes("required") ||
      message.includes("not found") ||
      message.includes("already exists")
        ? 400
        : 500;

    return NextResponse.json<InventoryApiResponse>(
      { success: false, message },
      { status },
    );
  } finally {
    dbSession.endSession();
  }
}
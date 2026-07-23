import mongoose, { InferSchemaType } from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    type: {
      type: String,
      enum: ["ADD", "REMOVE"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    vendorName: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    amountPaid: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

type TransactionBase = InferSchemaType<typeof transactionSchema>;
export type TransactionDocument = TransactionBase & {
  _id: mongoose.Types.ObjectId;
};

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

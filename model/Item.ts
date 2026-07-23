import mongoose, { InferSchemaType } from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "Units",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

type ItemBase = InferSchemaType<typeof itemSchema>;
export type ItemDocument = ItemBase & {
  _id: mongoose.Types.ObjectId;
};

export const Item =
  mongoose.models.Item || mongoose.model("Item", itemSchema);
import mongoose, { InferSchemaType } from "mongoose";

const storeItemsSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    addBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
type basetype = InferSchemaType<typeof storeItemsSchema>;
export type storeItemsInterface = basetype & {
  _id: mongoose.Types.ObjectId;
};

export const storeItems =
  mongoose.models.storeItems || mongoose.model("storeItems", storeItemsSchema);

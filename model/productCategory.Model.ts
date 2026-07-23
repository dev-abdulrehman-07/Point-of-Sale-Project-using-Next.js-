import mongoose, { Schema, model, models } from "mongoose";
import { InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }

);
export type ICategories = InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};



const Category = models.Category || model<ICategories>("Category", CategorySchema);

export default Category;
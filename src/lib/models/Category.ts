import mongoose, { Schema, model, type Model } from "mongoose";
import type { ICategory } from "@/types/category";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Kategori adı zorunludur"],
      unique: true,
      trim: true,
      maxlength: [100, "Kategori adı en fazla 100 karakter olabilir"],
    },
    slug: {
      type: String,
      required: [true, "Slug zorunludur"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [300, "Açıklama en fazla 300 karakter olabilir"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CategorySchema.virtual("newsCount", {
  ref: "News",
  localField: "_id",
  foreignField: "category",
  count: true,
});

const Category: Model<ICategory> =
  mongoose.models.Category ?? model<ICategory>("Category", CategorySchema);

export default Category;

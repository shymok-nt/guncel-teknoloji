import mongoose, { Schema, model, type Model } from "mongoose";
import type { INews } from "@/types/news";

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, "Haber başlığı zorunludur"],
      trim: true,
      maxlength: [200, "Başlık en fazla 200 karakter olabilir"],
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Slug zorunludur"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Haber içeriği zorunludur"],
    },
    summary: {
      type: String,
      required: [true, "Haber özeti zorunludur"],
      maxlength: [500, "Özet en fazla 500 karakter olabilir"],
    },
    mainImage: {
      type: String,
      required: [true, "Ana görsel zorunludur"],
    },
    author: {
      type: String,
      default: "Güncel Tekno Editörü",
    },
    sourceUrl: {
      type: String,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategori seçimi zorunludur"],
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    seoKeywords: {
      type: [String],
      default: [],
    },
    publishedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

NewsSchema.index({ title: "text", summary: "text", content: "text" });
NewsSchema.index({ publishedAt: -1, views: -1 });

NewsSchema.pre("save", function () {
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const News: Model<INews> =
  mongoose.models.News ?? model<INews>("News", NewsSchema);

export default News;

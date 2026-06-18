import type { Types } from "mongoose";
import type { ICategory } from "./category";

export interface INews {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  mainImage: string;
  category: Types.ObjectId | string;
  author: string;
  sourceUrl?: string;
  views: number;
  isPublished: boolean;
  seoKeywords: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedNews extends Omit<INews, "category" | "_id"> {
  _id: Types.ObjectId;
  category: ICategory;
  __v?: number;
}

export type CreateNewsDTO = Omit<
  INews,
  "_id" | "views" | "createdAt" | "updatedAt"
>;

export type UpdateNewsDTO = Partial<CreateNewsDTO>;

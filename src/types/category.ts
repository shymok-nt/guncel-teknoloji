import type { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCategoryDTO = Omit<ICategory, "_id" | "createdAt" | "updatedAt">;

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;

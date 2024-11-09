import { ObjectId } from "mongoose";

export interface ITestimonialReview {
  user: ObjectId;
  feedback: string;
  createdAt?: string;
  updatedAt?: string;
  isDelete?: boolean;
  isPublished?: boolean;
}

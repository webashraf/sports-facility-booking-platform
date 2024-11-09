// models/TestimonialReview.js

import { model, Schema } from "mongoose";
import { ITestimonialReview } from "./TestimonialReview.interface";

const TestimonialReviewSchema = new Schema<ITestimonialReview>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  feedback: {
    type: String,
    required: true,
    minlength: [10, "Feedback must be at least 10 characters long."],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
});

export const TestimonialReview = model<ITestimonialReview>(
  "TestimonialReview",
  TestimonialReviewSchema
);

import { HttpStatusCode } from "axios";
import AppError from "../../error/appError";
import { User } from "../User/user.model";
import { ITestimonialReview } from "./TestimonialReview.interface";
import { TestimonialReview } from "./TestimonialReview.modal";

const createOrUpdateTestimonialReviewIntoDB = async (
  payload: ITestimonialReview
) => {
  const isUserExistById = await User.isUserExistById(payload.user);

  const existingReview = await TestimonialReview.findOne({
    user: payload.user,
  });

  if (existingReview) {
    return await TestimonialReview.findOneAndUpdate(
      {
        user: payload.user,
      },
      { feedback: payload.feedback }
    );
  }

  console.log("existingReview", existingReview);

  if (!isUserExistById) {
    throw new AppError(HttpStatusCode.NotFound, "User does not exist");
  }

  return await TestimonialReview.create(payload);
};

export const TestimonialReviewService = {
  createOrUpdateTestimonialReviewIntoDB,
};

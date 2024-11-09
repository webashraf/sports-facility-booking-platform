import catchAsync from "../../utils/catchAsync";
import { TestimonialReviewService } from "./TestimonialReview.service";

const createTestimonialReview = catchAsync(async (req, res) => {
  const result =
    await TestimonialReviewService.createOrUpdateTestimonialReviewIntoDB(
      req.body
    );

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Testimonial review created successfully",
    data: result,
  });
});

export const testimonialReviewController = {
  createTestimonialReview,
};

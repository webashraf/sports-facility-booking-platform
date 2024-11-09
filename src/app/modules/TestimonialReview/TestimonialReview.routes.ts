import { Router } from "express";
import { testimonialReviewController } from "./TestimonialReview.controller";

const router = Router();

router.post("/create", testimonialReviewController.createTestimonialReview);

export const testimonialReviewRouter = router;

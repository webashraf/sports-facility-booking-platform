"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialReviewRouter = void 0;
const express_1 = require("express");
const TestimonialReview_controller_1 = require("./TestimonialReview.controller");
const router = (0, express_1.Router)();
router.post("/create", TestimonialReview_controller_1.testimonialReviewController.createTestimonialReview);
exports.testimonialReviewRouter = router;

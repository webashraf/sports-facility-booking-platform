"use strict";
// models/TestimonialReview.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialReview = void 0;
const mongoose_1 = require("mongoose");
const TestimonialReviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.TestimonialReview = (0, mongoose_1.model)("TestimonialReview", TestimonialReviewSchema);

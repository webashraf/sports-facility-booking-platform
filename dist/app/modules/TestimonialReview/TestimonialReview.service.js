"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialReviewService = void 0;
const axios_1 = require("axios");
const appError_1 = __importDefault(require("../../error/appError"));
const user_model_1 = require("../User/user.model");
const TestimonialReview_modal_1 = require("./TestimonialReview.modal");
const createOrUpdateTestimonialReviewIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExistById = yield user_model_1.User.isUserExistById(payload.user);
    const existingReview = yield TestimonialReview_modal_1.TestimonialReview.findOne({
        user: payload.user,
    });
    if (existingReview) {
        return yield TestimonialReview_modal_1.TestimonialReview.findOneAndUpdate({
            user: payload.user,
        }, { feedback: payload.feedback });
    }
    console.log("existingReview", existingReview);
    if (!isUserExistById) {
        throw new appError_1.default(axios_1.HttpStatusCode.NotFound, "User does not exist");
    }
    return yield TestimonialReview_modal_1.TestimonialReview.create(payload);
});
exports.TestimonialReviewService = {
    createOrUpdateTestimonialReviewIntoDB,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const auth_routes_1 = require("./app/modules/Auth/auth.routes");
const availability_routes_1 = require("./app/modules/Availability/availability.routes");
const booking_routes_1 = require("./app/modules/Booking/booking.routes");
const facility_routes_1 = require("./app/modules/Facility/facility.routes");
const payment_route_1 = require("./app/modules/Payment/payment.route");
const TestimonialReview_routes_1 = require("./app/modules/TestimonialReview/TestimonialReview.routes");
const user_routes_1 = require("./app/modules/User/user.routes");
const app = (0, express_1.default)();
const corsOptions = {
    credentials: true,
    origin: [
        // "http://localhost:3000",
        // "http://localhost:5173",
        "https://game-grounds-frontend.vercel.app",
        // "https://game-grouhnds-sports-facility-booking-backend.vercel.app",
        // "https://game-grounds-frontend-v135.vercel.app",
    ],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Define routes
app.use("/api/user/", user_routes_1.userRoute);
app.use("/api/facility/", facility_routes_1.facilityRoute);
app.use("/api/bookings", booking_routes_1.bookingRoute);
app.use("/api/auth/", auth_routes_1.AuthRoute);
app.use("/api/check-availability", availability_routes_1.availabilityRoute);
app.use("/api/payment/", payment_route_1.paymentRoute);
app.use("/api/testimonial-review/", TestimonialReview_routes_1.testimonialReviewRouter);
app.get("/", (req, res) => {
    res.send("Hello! Products");
});
// Global error handler
app.use(globalErrorHandler_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not Found",
    });
});
exports.default = app;

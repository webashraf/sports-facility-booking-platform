/* eslint-disable no-unused-vars */
import cors from "cors";
import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { AuthRoute } from "./app/modules/Auth/auth.routes";
import { availabilityRoute } from "./app/modules/Availability/availability.routes";
import { bookingRoute } from "./app/modules/Booking/booking.routes";
import { facilityRoute } from "./app/modules/Facility/facility.routes";
import { paymentRoute } from "./app/modules/Payment/payment.route";
import { testimonialReviewRouter } from "./app/modules/TestimonialReview/TestimonialReview.routes";
import { userRoute } from "./app/modules/User/user.routes";

const app = express();

const corsOptions = {
  credentials: true,
  origin: [
    // "http://localhost:3000",
    // "http://localhost:5173",
    "https://game-grounds-frontend.vercel.app",
    // "https://game-grounds-frontend-v135.vercel.app",
  ],
};

app.use(cors(corsOptions));

app.use(express.json());

// Define routes
app.use("/api/user/", userRoute);
app.use("/api/facility/", facilityRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/auth/", AuthRoute);
app.use("/api/check-availability", availabilityRoute);
app.use("/api/payment/", paymentRoute);
app.use("/api/testimonial-review/", testimonialReviewRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello! Products");
});

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});

export default app;

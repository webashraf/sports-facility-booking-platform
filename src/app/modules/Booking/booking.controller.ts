import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import { BookingService } from "./booking.service";

const createABooking = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret_key as string
  );

  const email = (decoded as JwtPayload).email;

  const result = await BookingService.createABookingIntoDB(req.body, email);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Booking created successfully",
    data: result,
  });
});


const retrieveBookings = catchAsync(async (req, res) => {
  const result = await BookingService.retrieveBookingsFromDB(req.query);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Bookings retrieved successfully!!",
    dataLength: result.dataLength,
    data: result.bookings,
  });
});

const retrieveBookingsForUser = catchAsync(async (req, res) => {
  const result = await BookingService.retrieveABookingsIntoDB(
    req.params.id,
    true
  );
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const deleteBookingForUser = catchAsync(async (req, res) => {
  const result = await BookingService.deleteABookingFromDB(req.params.id);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const BookingController = {
  createABooking,
  retrieveBookings,
  retrieveBookingsForUser,
  deleteBookingForUser,
};

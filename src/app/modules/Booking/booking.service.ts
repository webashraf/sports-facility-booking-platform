/* eslint-disable @typescript-eslint/no-explicit-any */
import { initiatePayment } from "../Payment/payment.utils";
import { User } from "../User/user.model";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { bookingUtils } from "./booking.utils";

const createABookingIntoDB = async (payload: TBooking, email: string) => {
  console.log(payload, email);

  const currentDate = new Date(payload.date);
  const today = new Date();
  const inputYear = payload.date.split("-");

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const findBookByCurrentDateAndFacility = await Booking.find({
      date: payload.date,
      facility: payload.facility,
    }).session(session);

    if (
      inputYear[0].length !== 4 ||
      !(Number(inputYear[1]) <= 12) ||
      Number(inputYear[1]) === 0 ||
      Number(inputYear[2]) === 0 ||
      !(Number(inputYear[2]) <= 31)
    ) {
      throw new Error(
        "Invalid date format! You must provide a date in YYYY-MM-DD format!!"
      );
    }

    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new Error("Could not find user!!");
    }

    const userId = user._id;
    payload.user = userId;

    const newTime = {
      startTime: payload.startTime,
      endTime: payload.endTime,
    };

    const isNotTimeFree = bookingUtils.doesOverlap(
      findBookByCurrentDateAndFacility,
      newTime
    );

    if (isNotTimeFree) {
      throw new Error("Time is already overlapped!!");
    }

    if (currentDate < today) {
      throw new Error("Date is out of range");
    }

    function generateUniqueTransactionId() {
      const randomString = Math.random().toString(36).substr(2, 9);
      const transactionId = `TXN-${Date.now()}-${randomString}`;
      return transactionId;
    }

    const transactionId = generateUniqueTransactionId();

    const paymentInfo = {
      transactionId,
      payment: payload.payableAmount,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };

    const paymentSession = await initiatePayment(paymentInfo);

    if (!paymentSession?.result) {
      throw new Error("Payment initiation failed!");
    }

    // Create the booking
    const result = await Booking.create([payload], { session });

    // If everything is successful, commit the transaction
    await session.commitTransaction();
    return { paymentSession, result };
  } catch (error: any) {
    // If there is an error, abort the transaction
    await session.abortTransaction();
    throw new Error(`Transaction failed: ${error?.message}`);
  } finally {
    // End the session
    session.endSession();
  }
};

const retrieveABookingsIntoDB = async (email: string, isUser: boolean) => {
  if (isUser) {
    const user = await User.findOne({ email: email });

    const result = await Booking.find({
      user: user?._id,
      isBooked: "confirmed",
    })
      .populate("user")
      .populate("facility");
    if (result.length < 1) {
      throw new Error("Could not find data");
    }
    return result;
  }
  const result = await Booking.find({ isBooked: "confirmed" })
    .populate("user")
    .populate("facility");
  if (result.length < 1) {
    throw new Error("Could not find data");
  }
  // const result = await Booking.find().populate("facility");
  return result;
};

const retrieveBookingsFromDB = async (query: Record<string, any>) => {
  const allBookings = await Booking.find();
  const filterQueryItems = {
    ...query,
  };

  const removableFields = ["searchTerm", "sort", "limit", "page", "fields"];

  removableFields.filter((item) => delete filterQueryItems[item]);

  // search results
  let searchTerm = "";
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  const searchQuery = Booking.find({
    $or: ["date", "facility.name"].map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  })
    .populate("user")
    .populate("facility");
  // Filter Queries
  const filterQuery = searchQuery.find(filterQueryItems);
  // Sort Queries
  let sort = "date";
  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  let page = 1;
  let limit = 0;
  let skip = 0;

  if (query?.limit) {
    limit = Number(query.limit) as number;
  }

  if (query?.page) {
    page = Number(query.page) as number;
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  let fields = "-__v";

  if (query?.fields) {
    fields = (query?.fields as string).split(",").join(" ");
  }

  const filedLimitQuery = await limitQuery.select(fields);

  return { bookings: filedLimitQuery, dataLength: allBookings.length };
};

const deleteABookingFromDB = async (id: string) => {
  const result = await Booking.findByIdAndUpdate(
    id,
    { isBooked: "canceled" },
    { runValidators: true, new: true }
  ).populate("facility");
  return result;
};

export const BookingService = {
  createABookingIntoDB,
  retrieveABookingsIntoDB,
  deleteABookingFromDB,
  retrieveBookingsFromDB,
};

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const payment_utils_1 = require("../Payment/payment.utils");
const user_model_1 = require("../User/user.model");
const booking_model_1 = require("./booking.model");
const booking_utils_1 = require("./booking.utils");
const createABookingIntoDB = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload, email);
    const currentDate = new Date(payload.date);
    const today = new Date();
    const inputYear = payload.date.split("-");
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const findBookByCurrentDateAndFacility = yield booking_model_1.Booking.find({
            date: payload.date,
            facility: payload.facility,
        }).session(session);
        if (inputYear[0].length !== 4 ||
            !(Number(inputYear[1]) <= 12) ||
            Number(inputYear[1]) === 0 ||
            Number(inputYear[2]) === 0 ||
            !(Number(inputYear[2]) <= 31)) {
            throw new Error("Invalid date format! You must provide a date in YYYY-MM-DD format!!");
        }
        const user = yield user_model_1.User.findOne({ email }).session(session);
        if (!user) {
            throw new Error("Could not find user!!");
        }
        const userId = user._id;
        payload.user = userId;
        const newTime = {
            startTime: payload.startTime,
            endTime: payload.endTime,
        };
        const isNotTimeFree = booking_utils_1.bookingUtils.doesOverlap(findBookByCurrentDateAndFacility, newTime);
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
        const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentInfo);
        if (!(paymentSession === null || paymentSession === void 0 ? void 0 : paymentSession.result)) {
            throw new Error("Payment initiation failed!");
        }
        // Create the booking
        const result = yield booking_model_1.Booking.create([payload], { session });
        // If everything is successful, commit the transaction
        yield session.commitTransaction();
        return { paymentSession, result };
    }
    catch (error) {
        // If there is an error, abort the transaction
        yield session.abortTransaction();
        throw new Error(`Transaction failed: ${error === null || error === void 0 ? void 0 : error.message}`);
    }
    finally {
        // End the session
        session.endSession();
    }
});
const retrieveABookingsIntoDB = (email, isUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (isUser) {
        const user = yield user_model_1.User.findOne({ email: email });
        const result = yield booking_model_1.Booking.find({
            user: user === null || user === void 0 ? void 0 : user._id,
            isBooked: "confirmed",
        })
            .populate("user")
            .populate("facility");
        if (result.length < 1) {
            throw new Error("Could not find data");
        }
        return result;
    }
    const result = yield booking_model_1.Booking.find({ isBooked: "confirmed" })
        .populate("user")
        .populate("facility");
    if (result.length < 1) {
        throw new Error("Could not find data");
    }
    // const result = await Booking.find().populate("facility");
    return result;
});
const retrieveBookingsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allBookings = yield booking_model_1.Booking.find();
    const filterQueryItems = Object.assign({}, query);
    const removableFields = ["searchTerm", "sort", "limit", "page", "fields"];
    removableFields.filter((item) => delete filterQueryItems[item]);
    // search results
    let searchTerm = "";
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        searchTerm = query.searchTerm;
    }
    const searchQuery = booking_model_1.Booking.find({
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
        sort = query.sort;
    }
    const sortQuery = filterQuery.sort(sort);
    let page = 1;
    let limit = 0;
    let skip = 0;
    if (query === null || query === void 0 ? void 0 : query.limit) {
        limit = Number(query.limit);
    }
    if (query === null || query === void 0 ? void 0 : query.page) {
        page = Number(query.page);
        skip = (page - 1) * limit;
    }
    const paginateQuery = sortQuery.skip(skip);
    const limitQuery = paginateQuery.limit(limit);
    let fields = "-__v";
    if (query === null || query === void 0 ? void 0 : query.fields) {
        fields = (query === null || query === void 0 ? void 0 : query.fields).split(",").join(" ");
    }
    const filedLimitQuery = yield limitQuery.select(fields);
    return { bookings: filedLimitQuery, dataLength: allBookings.length };
});
const deleteABookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, { isBooked: "canceled" }, { runValidators: true, new: true }).populate("facility");
    return result;
});
exports.BookingService = {
    createABookingIntoDB,
    retrieveABookingsIntoDB,
    deleteABookingFromDB,
    retrieveBookingsFromDB,
};

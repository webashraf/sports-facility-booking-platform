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
exports.FacilityController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const facility_service_1 = require("./facility.service");
const createFacility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_service_1.FacilityService.createFacilityIntoDB(req.body);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Facility added successfully",
        data: result,
    });
}));
const updateFacility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_service_1.FacilityService.updateFacilityIntoDB(req.params.id, req.body);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Facility updated successfully",
        data: result,
    });
}));
const deleteFacility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_service_1.FacilityService.deleteFacilityIntoDB(req.params.id);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Facility deleted successfully",
        data: result,
    });
}));
const retrieveFacility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_service_1.FacilityService.retrieveFacilityFromDB(req.query);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Facilities retrieved successfully",
        dataLength: result === null || result === void 0 ? void 0 : result.dataLength,
        data: result === null || result === void 0 ? void 0 : result.facilities,
    });
}));
const retrieveSingleFacility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_service_1.FacilityService.retrieveSingleFacilityFromDB(req.params.id);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Facilities retrieved successfully",
        data: result,
    });
}));
exports.FacilityController = {
    createFacility,
    updateFacility,
    deleteFacility,
    retrieveFacility,
    retrieveSingleFacility,
};

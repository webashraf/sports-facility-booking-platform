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
exports.FacilityService = void 0;
const facility_model_1 = require("./facility.model");
const createFacilityIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.create(payload);
    return result;
});
const updateFacilityIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteFacilityIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.findByIdAndUpdate(id, { isDeleted: true }, { new: true, runValidators: true });
    return result;
});
// const retrieveFacilityFromDBs = async () => {
//   const result = await Facility.find({ isDeleted: false });
//   if (result.length < 1) {
//     throw new NotFoundError(404, "No Data Found");
//   }
//   return result;
// };
const retrieveSingleFacilityFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield facility_model_1.Facility.findById(id);
    return result;
});
const retrieveFacilityFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allFacility = yield facility_model_1.Facility.find();
    const filterQueryItems = Object.assign({}, query);
    const removableFields = [
        "searchTerm",
        "sort",
        "limit",
        "page",
        "fields",
        "minPrice",
        "maxPrice",
    ];
    removableFields.forEach((field) => delete filterQueryItems[field]);
    // search
    let searchTerm = "";
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        searchTerm = query.searchTerm;
    }
    const searchQuery = facility_model_1.Facility.find({
        $or: ["name", "location"].map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" },
        })),
    });
    let minPrice = 0;
    let maxPrice = 10000;
    if (query === null || query === void 0 ? void 0 : query.minPrice) {
        minPrice = query.minPrice;
    }
    if (query === null || query === void 0 ? void 0 : query.maxPrice) {
        maxPrice = query.maxPrice;
    }
    const rangFilter = searchQuery.find({
        pricePerHour: { $gte: minPrice, $lte: maxPrice },
    });
    // Filter query
    const filterQuery = rangFilter.find(filterQueryItems);
    // sort
    let sort = "-pricePerHour";
    if (query === null || query === void 0 ? void 0 : query.sort) {
        sort = query.sort;
    }
    const sortQuery = filterQuery.sort(sort);
    let page = 1;
    let limit = 6;
    let skip = 0;
    if (query === null || query === void 0 ? void 0 : query.limit) {
        limit = Number(query.limit);
    }
    if (query === null || query === void 0 ? void 0 : query.page) {
        page = Number(query === null || query === void 0 ? void 0 : query.page);
        skip = (page - 1) * limit;
    }
    const paginateQuery = sortQuery.skip(skip);
    const limitQuery = paginateQuery.limit(limit);
    let fields = "-__v";
    if (query === null || query === void 0 ? void 0 : query.fields) {
        fields = query.fields.split(",").join(" ");
    }
    const filedLimitQuery = yield limitQuery.select(fields);
    return { facilities: filedLimitQuery, dataLength: allFacility === null || allFacility === void 0 ? void 0 : allFacility.length };
});
exports.FacilityService = {
    createFacilityIntoDB,
    updateFacilityIntoDB,
    deleteFacilityIntoDB,
    retrieveFacilityFromDB,
    retrieveSingleFacilityFromDB,
};

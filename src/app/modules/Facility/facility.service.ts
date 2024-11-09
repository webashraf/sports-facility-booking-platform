/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFacility } from "./facility.interface";
import { Facility } from "./facility.model";

const createFacilityIntoDB = async (payload: TFacility) => {
  const result = await Facility.create(payload);
  return result;
};

const updateFacilityIntoDB = async (
  id: string,
  payload: Partial<TFacility>
) => {
  const result = await Facility.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteFacilityIntoDB = async (id: string) => {
  const result = await Facility.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  return result;
};

// const retrieveFacilityFromDBs = async () => {
//   const result = await Facility.find({ isDeleted: false });
//   if (result.length < 1) {
//     throw new NotFoundError(404, "No Data Found");
//   }
//   return result;
// };

const retrieveSingleFacilityFromDB = async (id: string) => {
  const result = await Facility.findById(id);

  return result;
};

const retrieveFacilityFromDB = async (query: Record<string, unknown>) => {
  const allFacility = await Facility.find();
  const filterQueryItems: any = {
    ...query,
  };
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
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }
  const searchQuery = Facility.find({
    $or: ["name", "location"].map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  let minPrice = 0;
  let maxPrice = 10000;

  if (query?.minPrice) {
    minPrice = query.minPrice as number;
  }
  if (query?.maxPrice) {
    maxPrice = query.maxPrice as number;
  }

  const rangFilter = searchQuery.find({
    pricePerHour: { $gte: minPrice, $lte: maxPrice },
  });
  // Filter query
  const filterQuery = rangFilter.find(filterQueryItems);

  // sort
  let sort = "-pricePerHour";
  if (query?.sort) {
    sort = query.sort as string;
  }
  const sortQuery = filterQuery.sort(sort);

  let page = 1;
  let limit = 6;
  let skip = 0;
  if (query?.limit) {
    limit = Number(query.limit) as number;
  }
  if (query?.page) {
    page = Number(query?.page) as number;
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  let fields = "-__v";

  if (query?.fields) {
    fields = (query.fields as string).split(",").join(" ");
  }
  const filedLimitQuery = await limitQuery.select(fields);
  return { facilities: filedLimitQuery, dataLength: allFacility?.length };
};

export const FacilityService = {
  createFacilityIntoDB,
  updateFacilityIntoDB,
  deleteFacilityIntoDB,
  retrieveFacilityFromDB,
  retrieveSingleFacilityFromDB,
};

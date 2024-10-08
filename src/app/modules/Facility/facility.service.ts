import NotFoundError from "../../error/notFoundError";
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

const retrieveFacilityFromDB = async () => {
  const result = await Facility.find({ isDeleted: false });
  if (result.length < 1) {
    throw new NotFoundError(404, "No Data Found");
  }
  return result;
};
const retrieveSingleFacilityFromDB = async (id: string) => {
  const result = await Facility.findById(id);

  return result;
};

export const FacilityService = {
  createFacilityIntoDB,
  updateFacilityIntoDB,
  deleteFacilityIntoDB,
  retrieveFacilityFromDB,
  retrieveSingleFacilityFromDB,
};

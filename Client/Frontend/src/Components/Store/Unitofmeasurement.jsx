import { create } from "zustand";
import UnitOfMeasurementService from "../Api/Unitofmeasurement";

const useUnitOfMeasurementStore = create((set) => ({
    unitOfMeasurements: [],
    fetchUnitOfMeasurements: async () => {
        const data = await UnitOfMeasurementService.getAll();
        set({ unitOfMeasurements: data });
    },
    // Add more actions as needed
}));

export default useUnitOfMeasurementStore;

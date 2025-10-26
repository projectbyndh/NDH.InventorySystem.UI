import UnitOfMeasurementService from "../Api/Unitofmeasurement";

const useUnitOfMeasurement = () => {
    const getAll = async () => {
        const response = await UnitOfMeasurementService.getAll();
        return response.data;
    };

    const getById = async (id) => {
        const response = await UnitOfMeasurementService.getById(id);
        return response.data;
    };

    const create = async (uom) => {
        const response = await UnitOfMeasurementService.create(uom);
        return response.data;
    };

    const update = async (id, payload) => {
        const response = await UnitOfMeasurementService.update(id, payload);
        return response.data;
    };

    const remove = async (id) => {
        const response = await UnitOfMeasurementService.remove(id);
        return response.data;
    };

    return { getAll, getById, create, update, remove };
};

export default useUnitOfMeasurement;

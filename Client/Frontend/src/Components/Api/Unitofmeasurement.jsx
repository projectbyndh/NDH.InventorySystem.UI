import axiosInstance from "./AxiosInstance";

const UnitOfMeasurementService = {
    getAll: () => axiosInstance.get("UnitOfMeasure/getAll"),
    getById: (id) => axiosInstance.get(`UnitOfMeasure/getById/${id}`),
    create: (uom) => axiosInstance.post("UnitOfMeasure/create", uom),
    update: (id, payload) => axiosInstance.put(`UnitOfMeasure/update${id}`, payload),
    remove: (id) => axiosInstance.delete(`UnitOfMeasure/delete/${id}`),
};

export default UnitOfMeasurementService;
// src/api/WarehouseApi.js
import axiosInstance from "./AxiosInstance";

const unwrap = (res) => res?.data ?? res;

const WarehouseService = {
  getAll: (pagination) => axiosInstance.get("/Warehouse/getAll", { params: pagination }).then(unwrap),
  create: (payload) => axiosInstance.post("/Warehouse/create", payload).then(unwrap),
  update: (id, payload) => axiosInstance.put(`/Warehouse/update/${id}`, payload).then(unwrap),
  remove: (id) => axiosInstance.delete(`/Warehouse/delete/${id}`).then(unwrap),
};

export default WarehouseService;
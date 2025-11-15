// src/api/WarehouseApi.jsx
import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  const body = res?.data ?? res;
  return body?._data ?? body?.data ?? body;
};

const WarehouseService = {
  getAll: (pagination) =>
    axiosInstance.get("/Warehouse/getAll", { params: pagination }).then(unwrap),

  create: (payload) =>
    axiosInstance.post("/Warehouse/create", payload).then(unwrap),

  update: (id, payload) =>
    axiosInstance.put(`/Warehouse/update/${id}`, payload).then(unwrap),

  delete: (id) =>
    axiosInstance.delete(`/Warehouse/delete/${id}`).then(unwrap),
  getById: (id) =>
    axiosInstance.get(`/Warehouse/getById/${id}`).then(unwrap).catch(() => null),
};

export default WarehouseService;
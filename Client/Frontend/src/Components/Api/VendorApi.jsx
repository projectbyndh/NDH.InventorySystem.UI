// src/api/VendorApi.js
import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  const body = res?.data ?? res;
  return body?._data ?? body?.data ?? body;
};

const VendorService = {
  getAll: (pagination) => axiosInstance.get("/Vendor/getAll", { params: pagination }).then(unwrap),
  create: (payload) => axiosInstance.post("/Vendor/create", payload).then(unwrap),
  update: (id, payload) => axiosInstance.put(`/Vendor/update/${id}`, payload).then(unwrap),
  remove: (id) => axiosInstance.delete(`/Vendor/delete/${id}`).then(unwrap),
};

export default VendorService;
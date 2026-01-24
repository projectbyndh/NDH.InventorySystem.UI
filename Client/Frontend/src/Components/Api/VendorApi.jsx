import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  const body = res?.data ?? res;
  return body?._data ?? body?.data ?? body;
};

const VendorService = {
  getAll: (pagination) =>
    axiosInstance.get("/api/Vendor/getAll", { params: pagination }).then(unwrap),

  create: (payload) =>
    axiosInstance.post("/api/Vendor/create", payload).then(unwrap),

  update: (id, payload) =>
    axiosInstance.put(`/api/Vendor/update/${id}`, payload).then(unwrap),

  delete: (id) =>
    axiosInstance.delete(`/api/Vendor/delete/${id}`).then(unwrap),
  getById: (id) =>
    axiosInstance.get(`/api/Vendor/getById/${id}`).then(unwrap).catch(() => null),
};

export default VendorService;
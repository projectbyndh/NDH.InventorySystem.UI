// src/Components/Api/Categoryapi.jsx
import axiosInstance from "./AxiosInstance";

const parse = (raw) => (typeof raw === "string" ? JSON.parse(raw) : raw);

const unwrap = (res) => {
  const body = parse(res?.data ?? res);
  // Prefer standard envelope if present
  if (body && typeof body === "object") {
    if ("_data" in body) return body._data;
    if ("data" in body)  return body.data;
  }
  return body;
};

const CategoryService = {
  // Tries common param shapes if the server errors
  async getAll(pagination = { pageNumber: 1, pageSize: 50 }) {
    const attempts = [
      { params: { pageNumber: pagination.pageNumber, pageSize: pagination.pageSize } },
      { params: { PageNumber: pagination.pageNumber, PageSize: pagination.pageSize } },
      { params: { page: pagination.pageNumber, size: pagination.pageSize } },
      {}, // no params
    ];

    let lastErr;
    for (const opt of attempts) {
      try {
        const res = await axiosInstance.get("/Category/getAll", opt);
        // If server uses {_success,false} with 200, handle it too
        const raw = parse(res.data);
        if (raw?._success === false) {
          const msg = raw?._message || "Server returned _success=false";
          throw new Error(msg);
        }
        return unwrap(res);
      } catch (e) {
        lastErr = e;
        // If 404/400/500, try next variant
        if (!(e?.response?.status >= 500 || e?.response?.status >= 400)) break;
      }
    }
    // Re-throw last error after all attempts
    throw lastErr;
  },

  getById: (id) => axiosInstance.get(`/Category/getById/${id}`).then(unwrap),
  create:  (payload) => axiosInstance.post("/Category/create", payload).then(unwrap),
  update:  (id, payload) => axiosInstance.put(`/Category/update/${id}`, payload).then(unwrap),
  remove:  (id) => axiosInstance.delete(`/Category/delete/${id}`).then(unwrap),
};

export default CategoryService;

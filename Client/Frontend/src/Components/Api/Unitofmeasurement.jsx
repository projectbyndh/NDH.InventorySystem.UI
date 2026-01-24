// src/api/UnitOfMeasureApi.js
import axiosInstance from "./AxiosInstance";

const safeParse = (data) => {
  try { return typeof data === "string" ? JSON.parse(data) : data; }
  catch { return data; }
};

const unwrap = (res) => {
  const body = safeParse(res?.data ?? res);
  if (body && typeof body === "object") {
    if ("_data" in body) return body._data;
    if ("data" in body) return body.data;
  }
  return body;
};

const UnitOfMeasureService = {
  getAll: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const res = await axiosInstance.get("/api/UnitOfMeasure/getAll", {
      params: {
        PageNumber: pagination.pageNumber ?? 1,
        PageSize: pagination.pageSize ?? 50,
      },
    });
    return unwrap(res);
  },

  getById: (id) => axiosInstance.get(`/api/UnitOfMeasure/getById/${id}`).then(unwrap),

  create: (payload) => {
    const body = {
      name: payload.name?.trim(),
      symbol: payload.symbol?.trim(),
      description: payload.description?.trim() || undefined,
    };

    // Frontend validation (same as backend)
    if (!body.name || body.name.length < 1 || body.name.length > 100)
      throw new Error("Name must be 1–100 characters");
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(body.name))
      throw new Error("Name contains invalid characters");

    if (!body.symbol || body.symbol.length < 1 || body.symbol.length > 10)
      throw new Error("Symbol must be 1–10 characters");

    if (body.description && body.description.length > 500)
      throw new Error("Description too long (max 500)");

    console.log("UOM CREATE PAYLOAD:", body);
    return axiosInstance.post("/api/UnitOfMeasure/create", body).then(unwrap);
  },

  update: (id, payload) => {
    const body = {
      name: payload.name?.trim(),
      symbol: payload.symbol?.trim(),
      description: payload.description?.trim() || undefined,
    };

    if (!body.name || body.name.length < 1 || body.name.length > 100)
      throw new Error("Name must be 1–100 characters");
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(body.name))
      throw new Error("Name contains invalid characters");

    if (!body.symbol || body.symbol.length < 1 || body.symbol.length > 10)
      throw new Error("Symbol must be 1–10 characters");

    return axiosInstance.put(`/api/UnitOfMeasure/update/${id}`, body).then(unwrap);
  },

  delete: (id) => axiosInstance.delete(`/api/UnitOfMeasure/delete/${id}`).then(unwrap),
};

export default UnitOfMeasureService;
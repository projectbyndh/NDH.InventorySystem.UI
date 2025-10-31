// src/api/ProductApi.js
import axiosInstance from "./AxiosInstance";

const safeParse = (data) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return data;
  }
};

const unwrap = (res) => {
  const body = safeParse(res?.data ?? res);
  if (body && typeof body === "object") {
    if ("_data" in body) return body._data;
    if ("data" in body) return body.data;
  }
  return body;
};

const ProductService = {
  getAll: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const res = await axiosInstance.get("/Product/getAll", {
      params: {
        PageNumber: pagination.pageNumber ?? 1,
        PageSize: pagination.pageSize ?? 50,
      },
    });
    return unwrap(res);
  },

  getById: (id) => axiosInstance.get(`/Product/getById/${id}`).then(unwrap),

  create: (payload) => {
    const body = {
      name: payload.name?.trim(),
      description: payload.description?.trim() || undefined,
      sku: payload.sku?.trim() || undefined,
      price: Number(payload.price) || 0,
      cost: Number(payload.cost) || 0,
      quantityInStock: Number(payload.quantityInStock) || 0,
      minimumStockLevel: Number(payload.minimumStockLevel) || 0,
      reorderQuantity: Number(payload.reorderQuantity) || 0,
      categoryId: Number(payload.categoryId) || 0,
      subCategoryId: Number(payload.subCategoryId) || 0,
      unitOfMeasureId: Number(payload.unitOfMeasureId) || 0,
      primaryVendorId: Number(payload.primaryVendorId) || 0,
      status: payload.status || "Active",
      trackInventory: !!payload.trackInventory,
      isSerialized: !!payload.isSerialized,
      hasExpiry: !!payload.hasExpiry,
      variantGroupId: payload.variantGroupId?.trim() || undefined,
      variants: (payload.variants || []).map(v => ({
        id: Number(v.id) || 0,
        sku: v.sku?.trim() || undefined,
        price: Number(v.price) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
        attributesJson: v.attributesJson?.trim() || undefined,
      })),
      attributes: (payload.attributes || []).map(a => ({
        id: Number(a.id) || 0,
        name: a.name?.trim(),
        value: a.value?.trim(),
      })),
    };

    console.log("PRODUCT CREATE PAYLOAD:", body);
    return axiosInstance.post("/Product/create", body).then(unwrap);
  },

  update: (id, payload) => {
    const body = {
      name: payload.name?.trim(),
      description: payload.description?.trim() || undefined,
      sku: payload.sku?.trim() || undefined,
      price: Number(payload.price) || 0,
      cost: Number(payload.cost) || 0,
      quantityInStock: Number(payload.quantityInStock) || 0,
      minimumStockLevel: Number(payload.minimumStockLevel) || 0,
      reorderQuantity: Number(payload.reorderQuantity) || 0,
      categoryId: Number(payload.categoryId) || 0,
      subCategoryId: Number(payload.subCategoryId) || 0,
      unitOfMeasureId: Number(payload.unitOfMeasureId) || 0,
      primaryVendorId: Number(payload.primaryVendorId) || 0,
      status: payload.status || "Active",
      trackInventory: !!payload.trackInventory,
      isSerialized: !!payload.isSerialized,
      hasExpiry: !!payload.hasExpiry,
      variantGroupId: payload.variantGroupId?.trim() || undefined,
      variants: (payload.variants || []).map(v => ({
        id: Number(v.id) || 0,
        sku: v.sku?.trim() || undefined,
        price: Number(v.price) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
        attributesJson: v.attributesJson?.trim() || undefined,
      })),
      attributes: (payload.attributes || []).map(a => ({
        id: Number(a.id) || 0,
        name: a.name?.trim(),
        value: a.value?.trim(),
      })),
    };

    return axiosInstance.put(`/Product/update/${id}`, body).then(unwrap);
  },

  remove: (id) => axiosInstance.delete(`/Product/delete/${id}`).then(unwrap),
};

export default ProductService;
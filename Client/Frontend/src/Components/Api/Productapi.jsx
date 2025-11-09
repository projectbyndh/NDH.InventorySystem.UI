// src/api/ProductService.js
import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  const body = res?.data ?? res;
  if (body && typeof body === "object") {
    return body._data ?? body.data ?? body;
  }
  return body;
};

const clean = (obj) => {
  Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k]);
  return obj;
};

const ProductService = {
  // GET /api/Product/get-all
  getAll: async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    const res = await axiosInstance.get("/Product/get-all", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return unwrap(res);
  },

  getById: (id) => axiosInstance.get(`/Product/get-by-id/${id}`).then(unwrap),

  create: (payload) => {
    const body = clean({
      name: payload.name?.trim(),
      description: payload.description?.trim() || null,
      sku: payload.sku?.trim(),
      price: Number(payload.price) || 0,
      cost: Number(payload.cost) || 0,
      quantityInStock: Number(payload.quantityInStock) || 0,
      minimumStockLevel: Number(payload.minimumStockLevel) || 0,
      reorderQuantity: Number(payload.reorderQuantity) || 0,
      categoryId: Number(payload.categoryId) || 0,
      subCategoryId: payload.subCategoryId ?? null,
      unitOfMeasureId: payload.unitOfMeasureId ?? null,
      primaryVendorId: payload.primaryVendorId ?? null,
      status: payload.status || "Active",
      trackInventory: !!payload.trackInventory,
      isSerialized: !!payload.isSerialized,
      hasExpiry: !!payload.hasExpiry,
      variantGroupId: payload.variantGroupId?.trim() || null,
      variants: (payload.variants ?? [])
        .map((v) => clean({
          name: v.name?.trim() || null,
          sku: v.sku?.trim() || null,
          price: Number(v.price) || 0,
          stockQuantity: Number(v.stockQuantity) || 0,
          attributesJson: v.attributesJson?.trim() || null,
        }))
        .filter((v) => v.name || v.sku),
      attributes: (payload.attributes ?? [])
        .map((a) => clean({
          name: a.name?.trim() || null,
          value: a.value?.trim() || null,
        }))
        .filter((a) => a.name && a.value),
    });

    return axiosInstance.post("/Product/create", body).then(unwrap);
  },

  update: (id, payload) => {
    const body = clean({
      name: payload.name?.trim(),
      description: payload.description?.trim() || null,
      sku: payload.sku?.trim(),
      price: Number(payload.price) || 0,
      cost: Number(payload.cost) || 0,
      quantityInStock: Number(payload.quantityInStock) || 0,
      minimumStockLevel: Number(payload.minimumStockLevel) || 0,
      reorderQuantity: Number(payload.reorderQuantity) || 0,
      categoryId: Number(payload.categoryId) || 0,
      subCategoryId: payload.subCategoryId ?? null,
      unitOfMeasureId: payload.unitOfMeasureId ?? null,
      primaryVendorId: payload.primaryVendorId ?? null,
      status: payload.status || "Active",
      trackInventory: !!payload.trackInventory,
      isSerialized: !!payload.isSerialized,
      hasExpiry: !!payload.hasExpiry,
      variantGroupId: payload.variantGroupId?.trim() || null,
      variants: (payload.variants ?? [])
        .map((v) => clean({
          id: Number(v.id) || 0,
          name: v.name?.trim() || null,
          sku: v.sku?.trim() || null,
          price: Number(v.price) || 0,
          stockQuantity: Number(v.stockQuantity) || 0,
          attributesJson: v.attributesJson?.trim() || null,
        }))
        .filter((v) => v.name || v.sku),
      attributes: (payload.attributes ?? [])
        .map((a) => clean({
          id: Number(a.id) || 0,
          name: a.name?.trim() || null,
          value: a.value?.trim() || null,
        }))
        .filter((a) => a.name && a.value),
    });

    return axiosInstance.put(`/Product/update/${id}`, body).then(unwrap);
  },

  remove: (id) => axiosInstance.delete(`/Product/delete/${id}`).then(unwrap),
};

export default ProductService;
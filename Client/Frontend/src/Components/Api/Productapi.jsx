// src/api/ProductService.js
import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  const body = res?.data ?? res;
  if (body && typeof body === "object") {
    return body._data ?? body.data ?? body;
  }
  return body;
};

const ProductService = {
  // GET /Product/getAll?PageNumber=1&PageSize=10
  getAll: async ({ pageNumber = 1, pageSize = 20 }) => {
    const res = await axiosInstance.get("/Product/getAll", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return unwrap(res);
  },

  getById: (id) => axiosInstance.get(`/Product/getById/${id}`).then(unwrap),

  create: (payload) => {
    const body = {
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
        .map((v) => ({
          name: v.name?.trim() || null,
          sku: v.sku?.trim() || null,
          price: Number(v.price) || 0,
          stockQuantity: Number(v.stockQuantity) || 0,
          attributesJson: v.attributesJson?.trim() || null,
        }))
        .filter((v) => v.name || v.sku),
      attributes: (payload.attributes ?? [])
        .map((a) => ({
          name: a.name?.trim() || null,
          value: a.value?.trim() || null,
        }))
        .filter((a) => a.name && a.value),
    };

    // Remove null/undefined keys
    Object.keys(body).forEach((k) => body[k] == null && delete body[k]);

    console.log("CREATE →", JSON.stringify(body, null, 2));
    return axiosInstance.post("/Product/create", body).then(unwrap);
  },

  update: (id, payload) => {
    const body = {
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
        .map((v) => ({
          id: Number(v.id) || 0,
          name: v.name?.trim() || null,
          sku: v.sku?.trim() || null,
          price: Number(v.price) || 0,
          stockQuantity: Number(v.stockQuantity) || 0,
          attributesJson: v.attributesJson?.trim() || null,
        }))
        .filter((v) => v.name || v.sku),
      attributes: (payload.attributes ?? [])
        .map((a) => ({
          id: Number(a.id) || 0,
          name: a.name?.trim() || null,
          value: a.value?.trim() || null,
        }))
        .filter((a) => a.name && a.value),
    };

    Object.keys(body).forEach((k) => body[k] == null && delete body[k]);

    return axiosInstance.put(`/Product/update/${id}`, body).then(unwrap);
  },

  remove: (id) => axiosInstance.delete(`/Product/delete/${id}`).then(unwrap),
};

export default ProductService;
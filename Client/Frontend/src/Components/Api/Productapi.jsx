import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  const body = res?.data ?? res;
  if (body && typeof body === "object") {
    return body._data ?? body.data ?? body;
  }
  return body;
};

const ProductService = {
  // GET /api/Product/getAll?pageNumber=1&pageSize=20
  getAll: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const res = await axiosInstance.get("/Product/getAll", {
      params: {
        PageNumber: pagination.pageNumber ?? 1,
        PageSize: pagination.pageSize ?? 50,
      },
    });
    return unwrap(res);
  },

  // GET /api/Product/getById/{id}
  getById: (id) => axiosInstance.get(`/Product/getById/${id}`).then(unwrap),

  // POST /api/Product/create
  create: (payload) => {
    const body = {
      name: payload.name?.trim() || undefined,
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
        name: v.name?.trim() || undefined,
        sku: v.sku?.trim() || undefined,
        price: Number(v.price) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
        attributesJson: v.attributesJson?.trim() || undefined,
      })),
      attributes: (payload.attributes || []).map(a => ({
        name: a.name?.trim() || undefined,
        value: a.value?.trim() || undefined,
      })),
    };

    console.log("CREATE PAYLOAD →", JSON.stringify(body, null, 2));
    return axiosInstance.post("/Product/create", body).then(unwrap);
  },

  // PUT /api/Product/update/{id}
  update: (id, payload) => {
    const body = {
      name: payload.name?.trim() || undefined,
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
        name: v.name?.trim() || undefined,
        sku: v.sku?.trim() || undefined,
        price: Number(v.price) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
        attributesJson: v.attributesJson?.trim() || undefined,
      })),
      attributes: (payload.attributes || []).map(a => ({
        id: Number(a.id) || 0,
        name: a.name?.trim() || undefined,
        value: a.value?.trim() || undefined,
      })),
    };

    return axiosInstance.put(`/Product/update/${id}`, body).then(unwrap);
  },

  // DELETE /api/Product/delete/{id}
  remove: (id) => axiosInstance.delete(`/Product/delete/${id}`).then(unwrap),
};

export default ProductService;
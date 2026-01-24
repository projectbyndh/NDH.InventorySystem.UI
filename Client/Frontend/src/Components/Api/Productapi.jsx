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
  getAll: async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    const res = await axiosInstance.get("/api/Product/get-all", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return unwrap(res);
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/api/Product/get-by-id/${id}`);
    return unwrap(res);
  },

  create: async (payload) => {
    const dto = {
      Name: (payload.name || "").trim() || null,
      Description: payload.description?.trim() ?? null,
      SKU: payload.sku?.trim() ?? null,
      Price: Number(payload.price) || 0,
      Cost: Number(payload.cost) || 0,
      QuantityInStock: Number(payload.quantityInStock) || 0,
      MinimumStockLevel: Number(payload.minimumStockLevel) || 0,
      ReorderQuantity: Number(payload.reorderQuantity) || 0,

      CategoryId: payload.categoryId && !isNaN(Number(payload.categoryId)) && Number(payload.categoryId) > 0
        ? Number(payload.categoryId)
        : 0,

      SubCategoryId: payload.subCategoryId != null && !isNaN(Number(payload.subCategoryId))
        ? Number(payload.subCategoryId)
        : null,

      UnitOfMeasureId: payload.unitOfMeasureId != null && !isNaN(Number(payload.unitOfMeasureId))
        ? Number(payload.unitOfMeasureId)
        : null,

      PrimaryVendorId: payload.primaryVendorId != null && !isNaN(Number(payload.primaryVendorId))
        ? Number(payload.primaryVendorId)
        : null,

      Status: payload.status?.trim() || "Active",
      TrackInventory: !!payload.trackInventory,
      IsSerialized: !!payload.isSerialized,
      HasExpiry: !!payload.hasExpiry,
      VariantGroupId: payload.variantGroupId?.trim() ?? null,

      Variants: (payload.variants ?? []).map((v) => ({
        Name: v.name?.trim() ?? null,
        SKU: v.sku?.trim() ?? null,
        Price: Number(v.price) || 0,
        StockQuantity: Number(v.stockQuantity) || 0,
        AttributesJson: v.attributesJson?.trim() ?? null,
      })).filter((v) => v.Name || v.SKU),

      Attributes: (payload.attributes ?? []).map((a) => ({
        Name: a.name?.trim() ?? null,
        Value: a.value?.trim() ?? null,
      })).filter((a) => a.Name && a.Value),
    };

    console.log("Creating product – final payload:", JSON.stringify(dto, null, 2));

    const res = await axiosInstance.post("/api/Product/create", dto);
    return unwrap(res);
  },

  update: async (id, payload) => {
    const dto = {
      Name: (payload.name || "").trim() || null,
      Description: payload.description?.trim() ?? null,
      SKU: payload.sku?.trim() ?? null,
      Price: Number(payload.price) || 0,
      Cost: Number(payload.cost) || 0,
      QuantityInStock: Number(payload.quantityInStock) || 0,
      MinimumStockLevel: Number(payload.minimumStockLevel) || 0,
      ReorderQuantity: Number(payload.reorderQuantity) || 0,

      CategoryId: payload.categoryId && !isNaN(Number(payload.categoryId)) && Number(payload.categoryId) > 0
        ? Number(payload.categoryId)
        : 0,

      SubCategoryId: payload.subCategoryId != null && !isNaN(Number(payload.subCategoryId))
        ? Number(payload.subCategoryId)
        : null,

      UnitOfMeasureId: payload.unitOfMeasureId != null && !isNaN(Number(payload.unitOfMeasureId))
        ? Number(payload.unitOfMeasureId)
        : null,

      PrimaryVendorId: payload.primaryVendorId != null && !isNaN(Number(payload.primaryVendorId))
        ? Number(payload.primaryVendorId)
        : null,

      Status: payload.status?.trim() || "Active",
      TrackInventory: !!payload.trackInventory,
      IsSerialized: !!payload.isSerialized,
      HasExpiry: !!payload.hasExpiry,
      VariantGroupId: payload.variantGroupId?.trim() ?? null,

      Variants: (payload.variants ?? []).map((v) => ({
        Id: v.id != null ? Number(v.id) : undefined,
        Name: v.name?.trim() ?? null,
        SKU: v.sku?.trim() ?? null,
        Price: Number(v.price) || 0,
        StockQuantity: Number(v.stockQuantity) || 0,
        AttributesJson: v.attributesJson?.trim() ?? null,
      })).filter((v) => v.Name || v.SKU),

      Attributes: (payload.attributes ?? []).map((a) => ({
        Id: a.id != null ? Number(a.id) : undefined,
        Name: a.name?.trim() ?? null,
        Value: a.value?.trim() ?? null,
      })).filter((a) => a.Name && a.Value),
    };

    console.log(`Updating product ${id} – final payload:`, JSON.stringify(dto, null, 2));

    const res = await axiosInstance.put(`/api/Product/update/${id}`, dto);
    return unwrap(res);
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/api/Product/delete/${id}`);
    return unwrap(res);
  },
};

export default ProductService;
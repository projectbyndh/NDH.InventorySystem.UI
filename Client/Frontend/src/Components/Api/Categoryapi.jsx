// src/components/Api/Categoryapi.jsx
import axiosInstance from "./AxiosInstance";

// Helper to normalize response (handles different wrapper patterns)
const parseResponse = (res) => {
  const raw = res?.data ?? res;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
};

const unwrap = (res) => {
  const body = parseResponse(res);
  if (body && typeof body === "object") {
    return body._data ?? body.data ?? body;
  }
  return body;
};

const CategoryService = {
  getAll: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const res = await axiosInstance.get("/Category/getAll", {
      params: {
        PageNumber: pagination.pageNumber ?? 1,
        PageSize: pagination.pageSize ?? 50,
      },
    });
    return unwrap(res);
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/Category/getById/${id}`);
    return unwrap(res);
  },

  /**
   * Create category - matches exactly the working Swagger payload structure
   */
  create: async (payload) => {
    const body = {
      name: (payload.name || "").trim() || null, // backend probably requires name
      code: payload.code?.trim() ?? null,
      description: payload.description?.trim() ?? null,
      imageUrl: payload.imageUrl?.trim() ?? null,
      parentCategoryId: payload.parentCategoryId ? Number(payload.parentCategoryId) : null,
      hasVariants: !!payload.hasVariants,
      requiresSerialNumbers: !!payload.requiresSerialNumbers,
      trackExpiration: !!payload.trackExpiration,
      defaultUnitOfMeasure: payload.defaultUnitOfMeasure?.trim() ?? null,
      taxonomyPath: payload.taxonomyPath?.trim() ?? null,
      hierarchyLevel: Number(payload.hierarchyLevel) || 1,
      subCategories: null, // ← important: null, not [] or undefined
    };

    // Log the exact payload being sent (very useful for debugging)
    console.log("Creating category with payload:", JSON.stringify(body, null, 2));

    const res = await axiosInstance.post("/Category/create", body);
    return unwrap(res);
  },

  /**
   * Update category - safer handling of parentId
   */
  update: async (id, payload) => {
    const body = {
      name: (payload.name || "").trim() || null,
      code: payload.code?.trim() ?? null,
      description: payload.description?.trim() ?? null,
      imageUrl: payload.imageUrl?.trim() ?? null,
      // Very important: null for no parent, never send 0
      parentCategoryId: payload.parentCategoryId ? Number(payload.parentCategoryId) : null,
      hasVariants: !!payload.hasVariants,
      requiresSerialNumbers: !!payload.requiresSerialNumbers,
      trackExpiration: !!payload.trackExpiration,
      defaultUnitOfMeasure: payload.defaultUnitOfMeasure?.trim() ?? null,
      taxonomyPath: payload.taxonomyPath?.trim() ?? null,
      hierarchyLevel: Number(payload.hierarchyLevel) || 1,
      subCategories: null, // ← keep consistent with create
    };

    console.log(`Updating category ${id} with payload:`, JSON.stringify(body, null, 2));

    const res = await axiosInstance.put(`/Category/update/${id}`, body);
    return unwrap(res);
  },

  remove: async (id, config = {}) => {
    const res = await axiosInstance.delete(`/Category/delete/${id}`, config);
    return unwrap(res);
  },
};

export default CategoryService;
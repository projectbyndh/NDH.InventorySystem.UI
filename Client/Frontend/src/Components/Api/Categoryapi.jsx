// src/Components/Api/Categoryapi.jsx
import axiosInstance from "./AxiosInstance";

const parse = (raw) => (typeof raw === "string" ? JSON.parse(raw) : raw);
const unwrap = (res) => {
  const body = parse(res?.data ?? res);
  if (body && typeof body === "object") {
    if ("_data" in body) return body._data;
    if ("data" in body) return body.data;
  }
  return body;
};

// src/Components/Api/Categoryapi.jsx

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

  getById: (id) => axiosInstance.get(`/Category/getById/${id}`).then(unwrap),

  // 🟢 FIX HERE — remove `{ dto }` wrapper
// src/Components/Api/Categoryapi.jsx
create: (payload) => {
    const body = {
    name: payload.name?.trim(),
    code: payload.code?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    imageUrl: payload.imageUrl || undefined,
    parentCategoryId:
      payload.parentCategoryId == null || payload.parentCategoryId === "0"
        ? undefined
        : Number(payload.parentCategoryId),
    hasVariants: !!payload.hasVariants,
    requiresSerialNumbers: !!payload.requiresSerialNumbers,
    trackExpiration: !!payload.trackExpiration,
    defaultUnitOfMeasure: payload.defaultUnitOfMeasure || undefined,
    taxonomyPath: payload.taxonomyPath?.trim() || undefined,
    hierarchyLevel: payload.hierarchyLevel,
    subCategories: (payload.subCategories || [])
      .filter(s => s.name?.trim())
      .map(s => ({
        name: s.name.trim(),
        description: s.description?.trim() || undefined,
      })),
  };

  console.log("CREATE PAYLOAD:", body); // confirm camelCase + name present
  return axiosInstance.post("/Category/create", body).then(unwrap);
},

update: (id, payload) => {
    const body = {
    name: payload.name?.trim(),
    code: payload.code?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    imageUrl: payload.imageUrl || undefined,
    parentCategoryId:
      payload.parentCategoryId == null || payload.parentCategoryId === "0"
        ? undefined
        : Number(payload.parentCategoryId),
    hasVariants: !!payload.hasVariants,
    requiresSerialNumbers: !!payload.requiresSerialNumbers,
    trackExpiration: !!payload.trackExpiration,
    defaultUnitOfMeasure: payload.defaultUnitOfMeasure || undefined,
    taxonomyPath: payload.taxonomyPath?.trim() || undefined,
    hierarchyLevel: payload.hierarchyLevel,
    subCategories: (payload.subCategories || [])
      .filter(s => s.name?.trim())
      .map(s => ({
        name: s.name.trim(),
        description: s.description?.trim() || undefined,
      })),
  };

  return axiosInstance.put(`/Category/update/${id}`, body).then(unwrap);
},


  remove: (id, config = {}) => axiosInstance.delete(`/Category/delete/${id}`, config).then(unwrap),
};

export default CategoryService;


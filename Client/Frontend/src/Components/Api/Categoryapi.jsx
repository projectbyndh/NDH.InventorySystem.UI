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

const CategoryService = {
  // GET with PascalCase
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

 create: (payload) => {
  const dto = {
    Name: payload.name?.trim(),
    Code: payload.code?.trim() || undefined,
    Description: payload.description?.trim() || undefined,
    ImageUrl: payload.imageUrl || undefined,
    ParentCategoryId: payload.parentCategoryId === "0" ? undefined : Number(payload.parentCategoryId),
    HasVariants: payload.hasVariants,
    RequiresSerialNumbers: payload.requiresSerialNumbers,
    TrackExpiration: payload.trackExpiration,
    DefaultUnitOfMeasure: payload.defaultUnitOfMeasure || undefined,
    TaxonomyPath: payload.taxonomyPath?.trim() || undefined,
    HierarchyLevel: payload.hierarchyLevel,
    SubCategories: (payload.subCategories || [])
      .filter(s => s.name?.trim())
      .map(s => ({
        Name: s.name.trim(),
        Description: s.description?.trim() || undefined,
      })),
  };

  console.log("CREATE PAYLOAD:", { dto });

  return axiosInstance.post("/Category/create", { dto }).then(unwrap);
},

  update: (id, payload) => {
    const dto = {
      Name: payload.name?.trim(),
      Code: payload.code?.trim() || undefined,
      Description: payload.description?.trim() || undefined,
      ImageUrl: payload.imageUrl || undefined,
      ParentCategoryId: payload.parentCategoryId === "0" ? undefined : Number(payload.parentCategoryId),
      HasVariants: payload.hasVariants,
      RequiresSerialNumbers: payload.requiresSerialNumbers,
      TrackExpiration: payload.trackExpiration,
      DefaultUnitOfMeasure: payload.defaultUnitOfMeasure || undefined,
      TaxonomyPath: payload.taxonomyPath?.trim() || undefined,
      HierarchyLevel: payload.hierarchyLevel,
      SubCategories: (payload.subCategories || [])
        .filter(s => s.name?.trim())
        .map(s => ({
          Name: s.name.trim(),
          Description: s.description?.trim() || undefined,
        })),
    };

    return axiosInstance
      .put(`/Category/update/${id}`, { dto })
      .then(unwrap);
  },

  remove: (id) => axiosInstance.delete(`/Category/delete/${id}`).then(unwrap),
};

export default CategoryService;
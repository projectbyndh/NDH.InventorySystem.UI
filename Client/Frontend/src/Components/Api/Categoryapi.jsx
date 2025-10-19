import axiosInstance from "./AxiosInstance";

const CategoryService = {
  getAll: () => axiosInstance.get("Category/getAll"),
  getById: (id) => axiosInstance.get(`Category/getById/${id}`),

  create: (category) => axiosInstance.post("Category/create", category),

  update: (id, payload) => axiosInstance.put(`Category/update/${id}`, payload),
  remove: (id) => axiosInstance.delete(`Category/delete/${id}`),
  tree: () => axiosInstance.get("Category/tree"),
};

export default CategoryService;

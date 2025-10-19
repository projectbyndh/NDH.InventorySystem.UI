import axiosInstance from "./AxiosInstance";

const ProductService = {
  getAll: () => axiosInstance.get("Product/get-all"),
  getById: (id) => axiosInstance.get(`Product/get-by-id/${id}`),
  create: (product) => axiosInstance.post("Product/create", product),
  update: (id, payload) => axiosInstance.put(`Product/update/${id}`, payload),
  remove: (id) => axiosInstance.delete(`Product/delete/${id}`),
};

export default ProductService;
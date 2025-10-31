// src/store/ProductStore.js
import { create } from "zustand";
import ProductService from "../Api/Productapi";
import useLoginStore from "./Loginstore";

const useProductStore = create((set, get) => ({
  products: [],
  total: 0,
  loading: false,
  error: null,

  fetchProducts: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const token = useLoginStore.getState().token;
    if (!token) {
      set({ error: "Please log in." });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await ProductService.getAll(pagination);
      const list = data?.items ?? data?.data ?? data ?? [];
      const total = data?.total ?? data?.count ?? list.length ?? 0;
      set({ products: Array.isArray(list) ? list : [], total });
    } catch (err) {
      set({ error: err?.response?.data?._message || "Failed to load products." });
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return ProductService.create(payload);
  },

  updateProduct: async (id, payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return ProductService.update(id, payload);
  },

  deleteProduct: async (id) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return ProductService.remove(id);
  },
}));

export default useProductStore;
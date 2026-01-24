// src/store/ProductStore.js
import { create } from "zustand";
import ProductService from "../Api/Productapi";
import useLoginStore from "./Loginstore";
import { handleError } from "../Ui/errorHandler";

const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  total: 0,
  loading: false,
  error: null,

  // LIST
  fetchProducts: async (pagination = { pageNumber: 1, pageSize: 20 }) => {
    const token = useLoginStore.getState().token;
    if (!token) return set({ error: "Login required" });

    set({ loading: true, error: null });
    try {
      const data = await ProductService.getAll(pagination);
      const list = Array.isArray(data?.items) ? data.items : [];
      const total = data?.total ?? list.length;
      set({ products: list, total });
    } catch (err) {
      handleError(err, { title: "Failed to load products" });
      set({ error: err?.response?.data?._message || "Failed to load products" });
    } finally {
      set({ loading: false });
    }
  },

  // GET BY ID
  fetchProductById: async (id) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");

    set({ loading: true, error: null });
    try {
      const data = await ProductService.getById(id);
      set({ product: data });
      return data;
    } catch (err) {
      handleError(err, { title: "Product not found" });
      const msg = err?.response?.data?._message || "Product not found";
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // CREATE
  createProduct: async (payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return await ProductService.create(payload);
  },

  // UPDATE
  updateProduct: async (id, payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return await ProductService.update(id, payload);
  },

  // DELETE
  deleteProduct: async (id) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return await ProductService.delete(id);
  },

  clearProduct: () => set({ product: null }),
}));

export default useProductStore;
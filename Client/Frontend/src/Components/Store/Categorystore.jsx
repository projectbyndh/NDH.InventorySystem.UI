// src/Components/Store/Categorystore.jsx
import { create } from "zustand";
import CategoryService from "../Api/Categoryapi";
import useLoginStore from "./Loginstore";
import { handleError } from "../Ui/errorHandler";

const useCategoryStore = create((set, get) => ({
  categories: [],
  total: 0,
  loading: false,
  error: null,

  fetchCategories: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const token = useLoginStore.getState().token;
    if (!token) {
      set({ error: "Please log in." });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await CategoryService.getAll(pagination);
      const list = data?.items ?? data?.data ?? data ?? [];
      const total = data?.total ?? data?.count ?? list.length ?? 0;
      set({ categories: Array.isArray(list) ? list : [], total });
    } catch (err) {
      handleError(err, { title: "Failed to load categories" });
      set({ error: err?.response?.data?.message || "Failed to load." });
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return CategoryService.create(payload);
  },

  updateCategory: async (id, payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return CategoryService.update(id, payload);
  },

  deleteCategory: async (id, config = {}) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return CategoryService.delete(id, config);
  },
}));

export default useCategoryStore;
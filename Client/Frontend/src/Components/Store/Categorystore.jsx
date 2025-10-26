// src/Components/Store/Categorystore.jsx
import { create } from "zustand";
import CategoryService from "../Api/Categoryapi";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ error: "Not authenticated" });
      return;
    }
    set({ loading: true, error: null });
    try {
      const data = await CategoryService.getAll(pagination);
      const list = data?.items ?? data?.data ?? data ?? [];
      set({ categories: Array.isArray(list) ? list : [] });
    } catch (err) {
      const msg =
        err?.response?.data?._message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load categories";
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCategoryStore;

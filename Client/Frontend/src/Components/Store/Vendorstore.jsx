// src/store/VendorStore.js
import { create } from "zustand";
import VendorService from "../Api/VendorApi";
import useLoginStore from "./Loginstore";
import { handleError } from "../Ui/errorHandler";

const useVendorStore = create((set) => ({
  vendors: [],
  total: 0,
  loading: false,
  error: null,

  fetchVendors: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const token = useLoginStore.getState().token;
    if (!token) return set({ error: "Login required" });

    set({ loading: true, error: null });
    try {
      const data = await VendorService.getAll(pagination);
      const list = data?.items ?? data?.data ?? data ?? [];
      const total = data?.total ?? data?.count ?? list.length ?? 0;
      set({ vendors: Array.isArray(list) ? list : [], total });
    } catch (err) {
      handleError(err, { title: "Failed to load vendors" });
      set({ error: err?.response?.data?._message || "Load failed" });
    } finally {
      set({ loading: false });
    }
  },

  createVendor: async (payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return VendorService.create(payload);
  },

  updateVendor: async (id, payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return VendorService.update(id, payload);
  },

  deleteVendor: async (id) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return VendorService.delete(id);
  },
}));

export default useVendorStore;
// src/store/WarehouseStore.js
import { create } from "zustand";
import WarehouseService from "../Api/Warehouseapi"; // Fixed path
import useLoginStore from "./Loginstore";
import { handleError } from "../UI/errorHandler";

const useWarehouseStore = create((set) => ({
  warehouses: [],
  total: 0,
  loading: false,
  error: null,

  fetchWarehouses: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const token = useLoginStore.getState().token;
    if (!token) return set({ error: "Login required" });

    set({ loading: true, error: null });
    try {
      const data = await WarehouseService.getAll(pagination);
      const list = data?.items ?? data?.data ?? data ?? [];
      const total = data?.total ?? list.length;
      set({ warehouses: Array.isArray(list) ? list : [], total });
    } catch (err) {
      handleError(err, { title: "Failed to load warehouses" });
      set({ error: err?.response?.data?._message || "Load failed" });
    } finally {
      set({ loading: false });
    }
  },

  createWarehouse: async (payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return WarehouseService.create(payload);
  },

  updateWarehouse: async (id, payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return WarehouseService.update(id, payload);
  },

  deleteWarehouse: async (id) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return WarehouseService.delete(id);
  },
}));

export default useWarehouseStore;
// src/Store/UnitOfMeasureStore.js
import { create } from "zustand";
import UnitOfMeasureService from "../Api/Unitofmeasurement";
import useLoginStore from "./Loginstore";

const useUnitOfMeasureStore = create((set) => ({
  units: [],
  total: 0,
  loading: false,
  error: null,

  fetchUnits: async (pagination = { pageNumber: 1, pageSize: 50 }) => {
    const token = useLoginStore.getState().token;
    if (!token) return set({ error: "Login required" });

    set({ loading: true, error: null });
    try {
      const data = await UnitOfMeasureService.getAll(pagination);
      const list = data?.items ?? data?.data ?? data ?? [];
      const total = data?.total ?? data?.count ?? list.length ?? 0;
      set({ units: Array.isArray(list) ? list : [], total });
    } catch (err) {
      set({ error: err?.response?.data?._message || "Load failed" });
    } finally {
      set({ loading: false });
    }
  },

  createUnit: async (payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return UnitOfMeasureService.create(payload);
  },

  updateUnit: async (id, payload) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return UnitOfMeasureService.update(id, payload);
  },

  deleteUnit: async (id) => {
    const token = useLoginStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    return UnitOfMeasureService.remove(id);
  },
}));

export default useUnitOfMeasureStore;
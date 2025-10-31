// src/hooks/useWarehouse.jsx
import { useState, useEffect, useCallback } from "react";
import WarehouseService from "../Api/Warehouseapi"; 
import useLoginStore from "../Store/Loginstore";

export const useWarehouse = ({ pageSize = 10, autoFetch = true } = {}) => {
  const { token } = useLoginStore();

  const [warehouses, setWarehouses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchWarehouses = useCallback(
    async (customPage = page) => {
      if (!token) {
        setError("Please log in");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching warehouses...");
        const response = await WarehouseService.getAll({
          pageNumber: customPage,
          pageSize,
        });

        const list = response?.items ?? response?.data ?? response ?? [];
        const count = response?.total ?? list.length;

        setWarehouses(Array.isArray(list) ? list : []);
        setTotal(count);
      } catch (err) {
        const msg = err?.response?.data?._message || err?.message || "Failed to load warehouses";
        setError(msg);
        console.error("Warehouse fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [token, page, pageSize]
  );

  useEffect(() => {
    if (autoFetch && token) fetchWarehouses();
  }, [fetchWarehouses, autoFetch, token]);

  const createWarehouse = async (payload) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const created = await WarehouseService.create(payload);
      await fetchWarehouses(1);
      return created;
    } catch (err) {
      const msg = err?.response?.data?._message || "Create failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWarehouse = async (id, payload) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const updated = await WarehouseService.update(id, payload);
      await fetchWarehouses(page);
      return updated;
    } catch (err) {
      const msg = err?.response?.data?._message || "Update failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWarehouse = async (id) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true);
    try {
      await WarehouseService.delete(id);
      await fetchWarehouses(page);
    } catch (err) {
      const msg = err?.response?.data?._message || "Delete failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    warehouses,
    total,
    loading,
    error,
    page,
    setPage,
    fetchWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    clearError: () => setError(null),
  };
};
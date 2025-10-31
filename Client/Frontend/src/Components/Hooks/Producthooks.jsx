// src/hooks/useProducts.js
import { useEffect, useState, useCallback, useRef } from "react";
import ProductService from "../Api/Productapi";
import useLoginStore from "../Store/Loginstore";

export default function useProducts(initialPageSize = 20) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const token = useLoginStore((s) => s.token);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const fetchProducts = useCallback(async (page = pageNumber, size = pageSize) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAll({ pageNumber: page, pageSize: size });
      const list = data?.items ?? data?.data ?? data ?? [];
      if (!alive.current) return;
      setItems(Array.isArray(list) ? list : []);
      setTotal(data?.total ?? data?.count ?? list.length ?? 0);
      setPageNumber(page);
      setPageSize(size);
    } catch (err) {
      if (!alive.current) return;
      setError(err?.response?.data?._message || err.message);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [pageNumber, pageSize, token]);

  useEffect(() => {
    if (token) fetchProducts(1, initialPageSize);
  }, [token, initialPageSize, fetchProducts]);

  return {
    items, loading, error, total, pageNumber, pageSize,
    setPageNumber, setPageSize, fetchProducts,
  };
}
import { useEffect, useState, useCallback, useRef } from "react";
import CategoryService from "../Api/Categoryapi";
import useLoginStore from "../Store/Loginstore";

export default function useCategories(initialPageSize = 20) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const storeToken = useLoginStore((s) => s.token);
  const token = storeToken || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const prettyErr = (err) =>
    err?.response?.data?._message ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";

  const fetchCategories = useCallback(async (page = pageNumber, size = pageSize) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getAll({ pageNumber: page, pageSize: size });
      const list = data?.items ?? data?.data ?? data ?? [];
      if (!alive.current) return;
      setItems(Array.isArray(list) ? list : []);
      setTotal(data?.total ?? data?.count ?? list.length ?? 0);
      setPageNumber(page);
      setPageSize(size);
    } catch (err) {
      if (!alive.current) return;
      setError(prettyErr(err)); // will show “Internal Server Error: An unexpected error occurred.”
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [pageNumber, pageSize, token]);

  useEffect(() => {
    if (!token) return;
    fetchCategories(1, initialPageSize);
  }, [token, initialPageSize, fetchCategories]);

  return {
    items, loading, error, total, pageNumber, pageSize,
    setPageNumber, setPageSize, fetchCategories,
  };
}

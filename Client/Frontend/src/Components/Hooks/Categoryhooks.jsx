import { useState, useEffect } from "react";
import CategoryService from "../Api/Categoryapi";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🟦 Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Run fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // 🟩 Create new category
  const createCategory = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await CategoryService.create(payload);
      setCategories((prev) => [...prev, newCategory]);
      return true;
    } catch (err) {
      setError(err.message || "Failed to create category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🟥 Delete category
  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await CategoryService.remove(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
};

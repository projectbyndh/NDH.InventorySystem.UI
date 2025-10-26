// src/store/Productstore.jsx
import { create } from 'zustand';            // <-- FIX: named import
import ProductService from '../Api/Productapi';

const useProductStore = create((set, get) => ({
  // ---- state
  products: [],
  loading: false,
  error: null,

  // ---- actions
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await ProductService.getAll();
      // adapt if your API wraps data: resp?._data ?? resp
      const data = resp?._data ?? resp ?? [];
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: err?.message || 'Failed to load products', loading: false });
    }
  },

  createProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      const resp = await ProductService.create(payload);
      const newProduct = resp?._data ?? resp;
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err?.message || 'Failed to create product', loading: false });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await ProductService.remove(id);
      set((state) => ({
        // adjust id key if your API uses _id or productId
        products: state.products.filter((p) => p.id !== id && p._id !== id && p.productId !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err?.message || 'Failed to delete product', loading: false });
      return false;
    }
  },
}));

export default useProductStore;

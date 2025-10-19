import create from 'zustand';
import ProductService from './ProductService';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // 🟦 Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ProductService.getAll();
      set({ products: data || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load products', loading: false });
    }
  },

  // 🟩 Create new product
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await ProductService.create(productData);
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Failed to create product', loading: false });
      return false;
    }
  },

  // 🟨 Update product
  updateProduct: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await ProductService.update(id, payload);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        ),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Failed to update product', loading: false });
      return false;
    }
  },

  // 🟥 Delete product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await ProductService.remove(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Failed to delete product', loading: false });
      return false;
    }
  },
}));

export default useProductStore;
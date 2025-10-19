import create from 'zustand';
import CategoryService from '../Service/';

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // 🟦 Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await CategoryService.getAll();
      set({ categories: data || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load categories', loading: false });
    }
  },

  // 🟩 Create new category
  createCategory: async (payload) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await CategoryService.create(payload);
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Failed to create category', loading: false });
      return false;
    }
  },

  // 🟨 Update category
  updateCategory: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updatedCategory = await CategoryService.update(id, payload);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, ...updatedCategory } : cat
        ),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Failed to update category', loading: false });
      return false;
    }
  },

  // 🟥 Delete category
  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await CategoryService.remove(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Failed to delete category', loading: false });
      return false;
    }
  },
}));

export default useCategoryStore;
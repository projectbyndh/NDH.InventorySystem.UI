// src/Components/Store/Loginstore.jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoginStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setToken: (token) => set({ token }),
      setRefresh: (refreshToken) => set({ refreshToken }),
      clearAuth: () => set({ token: null, refreshToken: null }),
    }),
    { name: "auth_store" }
  )
);

export default useLoginStore;

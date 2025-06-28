import { create } from "zustand";

const useLoginStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setAuth: (user, token) => {
    localStorage.setItem("refreshToken", token);
    set({
      user,
      token,
      isLoggedIn: true,
    });
  },

  logout: () => {
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },
}));

export default useLoginStore;
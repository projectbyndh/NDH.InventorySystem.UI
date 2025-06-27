import { create } from "zustand";

const useLoginStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setAuth: (user, token) => {
    set({
      user,
      token,
      isLoggedIn: true,
    });
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },
}));

export default useLoginStore;

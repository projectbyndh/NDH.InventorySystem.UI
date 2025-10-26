// src/Hooks/useLoginHook.jsx   // (use .jsx since you're not using TS types)
import { useState } from "react";
import { loginUser } from "../Api/Loginapi";
import useLoginStore from "../Store/Loginstore";

const useLoginHook = () => {
  const [loading, setLoading] = useState(false);
  const { setToken, setRefresh } = useLoginStore();

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser({ userEmail: email, password });

      if (data?._success) {
        const p = data._data || {};
        const jwt = p.jwtToken;
        const refresh = p.refreshToken || null;
        if (!jwt) throw new Error("Login response missing jwtToken");

        setToken(jwt);
        setRefresh(refresh);

        return { ok: true };
      }
      return { ok: false, error: data?._message || "Login failed" };
    } catch (e) {
      return { ok: false, error: e?.message || String(e) };
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
};

export default useLoginHook;

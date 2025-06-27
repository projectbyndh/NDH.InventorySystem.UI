import { useState } from "react";
import { loginUser } from "../Api/Loginapi";
import useLoginStore from "../Store/Loginstore";

const useLoginHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAuth = useLoginStore((state) => state.setAuth);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      if (response.data.success) {
        setAuth(response.data.user, response.data.token);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLoginHooks;

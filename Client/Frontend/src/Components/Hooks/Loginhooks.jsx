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
      console.log("Raw response data:", response.data); // Debug the raw data

      const data = response.data;
      if (data._statusCode === "OK" && data._message === "Login Successful") {
        const user = { id: data._data.userId }; // Adjust user object as needed
        const token = data._data.refreshToken;
        setAuth(user, token);
        return data; // Return data for further use if needed
      } else {
        throw new Error(data._message || "Login failed due to unexpected response");
      }
    } catch (err) {
      setError(
        err.response?.data?._message ||
        err.message ||
        "An error occurred during login"
      );
      console.error("Login error details:", err); // Debug error details
      throw err; // Re-throw to be caught in handleSubmit
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLoginHooks;
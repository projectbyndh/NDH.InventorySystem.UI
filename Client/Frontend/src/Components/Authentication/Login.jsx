import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLoginHook from "../Hooks/Loginhooks";  // ✅ make sure filename matches
import useLoginStore from "../Store/Loginstore";

const LoginPage = () => {
  const { handleLogin, loading } = useLoginHook(); // ✅ fixed destructuring
  const token = useLoginStore((s) => s.token); // ✅ store has token
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in (store or token in localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken || token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await handleLogin(email, password); // ✅ matches your hook signature
      // Redirect handled automatically by effect above after token is set
    },
    [email, password, handleLogin]
  );

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <form onSubmit={handleSubmit} autoComplete="on">
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 5 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 5 }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

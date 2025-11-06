import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLoginHook from "../Hooks/Loginhooks";
import useLoginStore from "../Store/Loginstore";

const LoginPage = () => {
  const { handleLogin, loading } = useLoginHook();
  const token = useLoginStore((s) => s.token);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken || token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password) return;
      await handleLogin(email, password);
    },
    [email, password, handleLogin]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center text-white text-2xl font-light tracking-wider">
              A
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">Sign in to your account</h1>
            <p className="mt-1 text-sm text-gray-500">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 
                         focus:ring-2 focus:ring-gray-900 focus:border-transparent 
                         transition-all duration-200 outline-none disabled:bg-gray-50"
                placeholder="name@company.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 
                         focus:ring-2 focus:ring-gray-900 focus:border-transparent 
                         transition-all duration-200 outline-none disabled:bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg 
                       shadow-sm transition-all duration-200 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
            <a href="#" className="hover:text-gray-700 transition-colors">
              Forgot your password?
            </a>
            <div className="text-xs text-gray-400 mt-4">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-gray-600">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-gray-600">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>

        {/* Subtle Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} YourCompany, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
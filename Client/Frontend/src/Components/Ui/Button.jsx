// src/components/ui/Button.jsx
import React from "react";
import Spinner from "./Spinner";

/**
 * Button - Enhanced global button component with multiple variants
 * Use ActionButton for page-level actions, FormButton for form submissions
 * This is for general-purpose buttons throughout the app
 */
const Button = ({
  children,
  variant = "primary", // primary | secondary | danger | success | outline | ghost
  size = "md", // sm | md | lg
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left", // left | right
  fullWidth = false,
  className = "",
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${fullWidth ? "w-full" : ""}
  `;

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  const variants = {
    primary: `
      bg-slate-900 text-white shadow-md
      hover:bg-black hover:shadow-lg
      focus:ring-slate-500
    `,
    secondary: `
      bg-slate-100 text-slate-900 shadow-sm
      hover:bg-slate-200 hover:shadow-md
      focus:ring-slate-300
    `,
    danger: `
      bg-red-600 text-white shadow-md
      hover:bg-red-700 hover:shadow-lg
      focus:ring-red-500
    `,
    success: `
      bg-emerald-600 text-white shadow-md
      hover:bg-emerald-700 hover:shadow-lg
      focus:ring-emerald-500
    `,
    outline: `
      border-2 border-slate-300 text-slate-700 bg-white
      hover:bg-slate-50 hover:border-slate-400
      focus:ring-slate-300
    `,
    ghost: `
      text-slate-700 hover:bg-slate-100
      focus:ring-slate-300
    `,
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Spinner size={iconSize[size].match(/\d+/)[0]} className="inline-block" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className={iconSize[size]} />}
          {children}
          {Icon && iconPosition === "right" && <Icon className={iconSize[size]} />}
        </>
      )}
    </button>
  );
};

export default Button;

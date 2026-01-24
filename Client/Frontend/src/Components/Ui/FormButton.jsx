// src/Components/Ui/FormButton.jsx
import React from "react";
import Spinner from "./Spinner";

/**
 * FormButton - Standardized buttons for form actions (Create/Update/Cancel)
 * Provides consistent styling and loading states across all forms
 */
const FormButton = ({
    children,
    type = "button", // button | submit
    variant = "primary", // primary | secondary | danger
    loading = false,
    loadingText = "Saving...",
    disabled = false,
    onClick,
    className = "",
    fullWidth = false,
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg
    transition-all disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : "flex-1"}
  `;

    const variants = {
        primary: `
      bg-slate-900 text-white shadow-lg
      hover:bg-black hover:shadow-xl
      active:scale-95
    `,
        secondary: `
      border-2 border-slate-300 text-slate-700
      hover:bg-slate-50 hover:border-slate-400
      active:scale-95
    `,
        danger: `
      bg-red-600 text-white shadow-lg
      hover:bg-red-700 hover:shadow-xl
      active:scale-95
    `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`.trim()}
        >
            {loading ? (
                <>
                    <Spinner size={6} className="inline-block" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default FormButton;

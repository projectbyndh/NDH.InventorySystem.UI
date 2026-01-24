// src/Components/Ui/IconActionButton.jsx
import React from "react";

/**
 * IconActionButton - Small icon buttons for table actions (Edit, Delete, View, etc.)
 * Provides consistent styling for action buttons in tables and lists
 */
const IconActionButton = ({
    icon: Icon,
    onClick,
    variant = "default", // default | edit | delete | view | info
    disabled = false,
    ariaLabel,
    className = "",
    size = "md", // sm | md | lg
}) => {
    const baseStyles = `
    p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-90
  `;

    const sizes = {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-2.5",
    };

    const iconSizes = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const variants = {
        default: `
      hover:bg-slate-100 text-slate-600
      hover:text-slate-900
    `,
        edit: `
      hover:bg-blue-50 text-blue-600
      hover:text-blue-700
    `,
        delete: `
      hover:bg-red-50 text-red-600
      hover:text-red-700
    `,
        view: `
      hover:bg-emerald-50 text-emerald-600
      hover:text-emerald-700
    `,
        info: `
      hover:bg-amber-50 text-amber-600
      hover:text-amber-700
    `,
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
        >
            {Icon && <Icon className={iconSizes[size]} />}
        </button>
    );
};

export default IconActionButton;

// src/Components/Ui/ActionButton.jsx
import React from "react";
import { Plus } from "lucide-react";

/**
 * ActionButton - Global button for primary page actions like "Add Vendor", "Add Warehouse", etc.
 * Consistent styling across all management pages
 */
const ActionButton = ({
    children,
    onClick,
    icon: Icon = Plus,
    disabled = false,
    className = "",
    variant = "primary", // primary | secondary
}) => {
    const baseStyles = `
    inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold
    transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-slate-900 text-white
      hover:bg-black hover:shadow-xl
      active:scale-95
    `,
        secondary: `
      bg-white text-slate-900 border-2 border-slate-300
      hover:bg-slate-50 hover:border-slate-400
      active:scale-95
    `,
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`.trim()}
        >
            {Icon && <Icon className="w-6 h-6" />}
            {children}
        </button>
    );
};

export default ActionButton;

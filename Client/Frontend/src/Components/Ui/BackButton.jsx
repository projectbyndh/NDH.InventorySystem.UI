// src/Components/Ui/BackButton.jsx
import React from "react";
import { ChevronLeft } from "lucide-react";

/**
 * BackButton - Consistent back navigation button for form pages
 */
const BackButton = ({
    onClick,
    label = "Back",
    showLabel = false,
    className = "",
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        p-3 rounded-xl bg-white shadow-sm hover:shadow-md
        transition-all active:scale-95
        flex items-center gap-2
        ${className}
      `.trim()}
            aria-label={label}
        >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
            {showLabel && <span className="text-slate-700 font-medium">{label}</span>}
        </button>
    );
};

export default BackButton;

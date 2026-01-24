import React from "react";
import ActionButton from "./ActionButton";
import BackButton from "./BackButton";

/**
 * Shared PageHeader component for consistency across the ERP system.
 * @param {string} title - The main page title.
 * @param {string} subtitle - Optional description text.
 * @param {string} btnText - Optional text for the primary action button.
 * @param {function} onBtnClick - Optional click handler for the primary button.
 * @param {React.ReactNode} breadcrumbs - Optional breadcrumb elements.
 * @param {boolean} showBack - Whether to show the back button.
 * @param {function} onBack - Optional back button handler.
 */
export default function PageHeader({
    title,
    subtitle,
    btnText,
    onBtnClick,
    breadcrumbs,
    showBack,
    onBack,
    icon: Icon
}) {
    return (
        <div className="mb-8 animate-fadeIn">
            {/* Breadcrumbs */}
            {breadcrumbs && (
                <nav className="mb-4 text-sm text-slate-500 flex items-center gap-2">
                    {breadcrumbs}
                </nav>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    {showBack && <BackButton onClick={onBack} />}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            {Icon && <Icon className="w-8 h-8 text-slate-700" />}
                            {title}
                        </h1>
                        {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
                    </div>
                </div>

                {btnText && onBtnClick && (
                    <ActionButton onClick={onBtnClick} icon={Icon}>
                        {btnText}
                    </ActionButton>
                )}
            </div>
        </div>
    );
}

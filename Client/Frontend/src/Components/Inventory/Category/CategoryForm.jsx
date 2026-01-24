import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, AlertCircle, CheckCircle } from "lucide-react";
import useCategoryStore from "../../Store/Categorystore";
import FormButton from "../../Ui/FormButton";
import PageHeader from "../../Ui/PageHeader";
import SectionCard from "../../Ui/SectionCard";
import { handleError } from "../../Ui/errorHandler";

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const {
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        loading: storeLoading,
    } = useCategoryStore();

    const [form, setForm] = useState({
        name: "",
        code: "",
        description: "",
        parentCategoryId: null,
        hasVariants: false,
        requiresSerialNumbers: false,
        trackExpiration: false,
        defaultUnitOfMeasure: "",
        taxonomyPath: "",
        hierarchyLevel: 1,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            if (categories.length === 0) {
                await fetchCategories();
            }
            if (isEdit) {
                const category = categories.find((c) => String(c.id) === String(id));
                if (category) {
                    setForm({
                        name: category.name || "",
                        code: category.code || "",
                        description: category.description || "",
                        parentCategoryId: category.parentCategoryId ?? null,
                        hasVariants: !!category.hasVariants,
                        requiresSerialNumbers: !!category.requiresSerialNumbers,
                        trackExpiration: !!category.trackExpiration,
                        defaultUnitOfMeasure: category.defaultUnitOfMeasure || "",
                        taxonomyPath: category.taxonomyPath || "",
                        hierarchyLevel: category.hierarchyLevel ?? 1,
                    });
                }
            }
        };
        load();
    }, [id, isEdit, categories, fetchCategories]);

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Category name is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setSuccess(false);

        try {
            const payload = {
                ...form,
                name: form.name.trim(),
                parentCategoryId: form.parentCategoryId ? Number(form.parentCategoryId) : null,
            };

            if (isEdit) {
                await updateCategory(id, payload);
            } else {
                await createCategory(payload);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/categories");
            }, 1000);
        } catch (err) {
            handleError(err, { title: "Save failed" });
            setErrors({ submit: err?.response?.data?.message || "Failed to save category" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <PageHeader
                title={isEdit ? "Edit Category" : "Add New Category"}
                subtitle={isEdit ? "Update category specifications" : "Create a new product classification"}
                showBack
                onBack={() => navigate("/categories")}
                icon={Tag}
            />

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-slideUp">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Category saved successfully! Redirecting...</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <SectionCard title="Basic Information">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border text-base transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.name ? "border-red-500" : "border-slate-300"}`}
                                placeholder="e.g. Electronics"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Category Code</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => handleFormChange("code", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                placeholder="e.g. ELEC-001"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                                rows={3}
                                placeholder="Details about this category..."
                            />
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Hierarchy & Settings">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Parent Category</label>
                            <select
                                value={form.parentCategoryId ?? ""}
                                onChange={(e) => handleFormChange("parentCategoryId", e.target.value || null)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
                            >
                                <option value="">None (Root Category)</option>
                                {categories.filter(c => String(c.id) !== String(id)).map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col justify-center gap-4">
                            <label className="inline-flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.hasVariants}
                                    onChange={(e) => handleFormChange("hasVariants", e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Has Product Variants</span>
                            </label>

                            <label className="inline-flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.trackExpiration}
                                    onChange={(e) => handleFormChange("trackExpiration", e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Track Item Expiration</span>
                            </label>
                        </div>
                    </div>
                </SectionCard>

                {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fadeIn">
                        {errors.submit}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <FormButton
                        type="submit"
                        variant="primary"
                        loading={loading}
                        loadingText="Saving Category..."
                    >
                        {isEdit ? "Update Category" : "Save Category"}
                    </FormButton>

                    <FormButton
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/categories")}
                        disabled={loading}
                    >
                        Cancel
                    </FormButton>
                </div>
            </form>
        </div>
    );
}

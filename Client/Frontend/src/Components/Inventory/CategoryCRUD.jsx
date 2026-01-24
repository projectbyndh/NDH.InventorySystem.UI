// src/components/Inventory/CategoryCRUD.jsx
import React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import useCategoryStore from "../Store/Categorystore";
import Spinner from "../Ui/Spinner";
import { handleError } from "../Ui/errorHandler";
import ActionButton from "../Ui/ActionButton";
import FormButton from "../Ui/FormButton";
import BackButton from "../Ui/BackButton";
import IconActionButton from "../Ui/IconActionButton";
import EmptyState from "../Ui/EmptyState";
import { Tag } from "lucide-react";

export default function CategoryCRUD() {
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading: storeLoading,
  } = useCategoryStore();

  // List mode states
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Form mode states
  const [mode, setMode] = useState("list"); // "list" | "form"
  const [editingCategory, setEditingCategory] = useState(null);
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
    subCategories: null,
  });
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    fetchCategories({ pageNumber: page, pageSize });
  }, [page, fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.code?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
    );
  }, [categories, search]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const parentOptions = useMemo(() => {
    const base = [{ value: null, label: "None (Top-level)" }];
    const opts = (categories || []).map((c) => ({ value: c.id, label: c.name }));
    return [...base, ...opts];
  }, [categories]);

  // ──────────────────────────────────────────────
  // Form handlers
  // ──────────────────────────────────────────────

  const startCreate = () => {
    setMode("form");
    setEditingCategory(null);
    setForm({
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
      subCategories: null,
    });
    setErrors({});
    setSuccess(false);
  };

  const startEdit = (category) => {
    setMode("form");
    setEditingCategory(category);
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
      subCategories: Array.isArray(category.subCategoryNames) ? category.subCategoryNames : null,
    });
    setErrors({});
    setSuccess(false);
  };

  const cancelForm = () => {
    setMode("list");
    setEditingCategory(null);
    setForm({
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
      subCategories: null,
    });
    setErrors({});
  };

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    setSuccess(false);

    try {
      const payload = {
        name: form.name.trim(),
        code: form.code?.trim() || "",
        description: form.description?.trim() || "",
        imageUrl: form.imageUrl?.trim?.() || "",
        parentCategoryId: form.parentCategoryId ? Number(form.parentCategoryId) : null,
        hasVariants: !!form.hasVariants,
        requiresSerialNumbers: !!form.requiresSerialNumbers,
        trackExpiration: !!form.trackExpiration,
        defaultUnitOfMeasure: form.defaultUnitOfMeasure?.trim() || "",
        taxonomyPath: form.taxonomyPath?.trim() || "",
        hierarchyLevel: Number(form.hierarchyLevel) || 1,
        subCategories: form.subCategories && form.subCategories.length ? form.subCategories : null,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await createCategory(payload);
      }

      setSuccess(true);
      await fetchCategories({ pageNumber: 1, pageSize });
      setTimeout(() => {
        cancelForm();
      }, 1200);
    } catch (err) {
      handleError(err, { title: "Save failed" });
      setErrors({ submit: err?.response?.data?.message || "Failed to save category" });
    } finally {
      setFormLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Delete handlers
  // ──────────────────────────────────────────────

  const openDeleteModal = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteCategory(deleteModal.id);
      await fetchCategories({ pageNumber: page, pageSize });
      closeDeleteModal();
    } catch (err) {
      handleError(err, { title: "Delete failed" });
    }
  };

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────

  if (mode === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <BackButton onClick={cancelForm} />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h1>
              <p className="text-slate-600 mt-1">
                {editingCategory ? "Update category details" : "Create a new product category"}
              </p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Saved successfully!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="e.g. Electronics, Clothing, Food"
                  className={`w-full px-4 py-3 rounded-xl border text-base transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.name ? "border-red-500" : "border-slate-300"
                    }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-slate-800 mb-2">
                  Code <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <input
                  id="code"
                  type="text"
                  value={form.code}
                  onChange={(e) => handleFormChange("code", e.target.value)}
                  placeholder="e.g. BEV001"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-2">
                  Description <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={4}
                  placeholder="Brief description of this category..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Parent Category <span className="text-slate-400 text-xs">(optional)</span></label>
                  <select
                    value={form.parentCategoryId ?? ""}
                    onChange={(e) => handleFormChange("parentCategoryId", e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">None (Top-level)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Flags <span className="text-slate-400 text-xs">(optional)</span></label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!form.hasVariants}
                        onChange={(e) => handleFormChange("hasVariants", e.target.checked)}
                        className="form-checkbox h-4 w-4"
                      />
                      <span>Has variants</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!form.trackExpiration}
                        onChange={(e) => handleFormChange("trackExpiration", e.target.checked)}
                        className="form-checkbox h-4 w-4"
                      />
                      <span>Track expiration</span>
                    </label>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errors.submit}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <FormButton
                  type="submit"
                  variant="primary"
                  loading={formLoading}
                  loadingText="Saving..."
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </FormButton>

                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={cancelForm}
                  disabled={formLoading}
                >
                  Cancel
                </FormButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // List view
  // ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-600 mt-1">Manage product categories</p>
          </div>
          <ActionButton onClick={startCreate}>
            Add Category
          </ActionButton>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, code or description..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {storeLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-500">
              <Spinner className="w-12 h-12 mb-4" />
              <p>Loading categories...</p>
            </div>
          ) : paginatedCategories.length === 0 ? (
            <EmptyState
              icon={<Tag className="w-12 h-12 text-slate-300" />}
              title="No categories found"
              subtitle="Get started by organizing your products into categories."
              action={
                <ActionButton onClick={startCreate} size="sm">
                  Create your first category
                </ActionButton>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Code</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Description</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Parent</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Subcategories</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                      <td className="px-6 py-4 text-slate-600">{cat.code || "—"}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-md truncate">{cat.description || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{cat.parentCategoryName || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{(cat.subCategoryNames && cat.subCategoryNames.length) ? cat.subCategoryNames.join(", ") : "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <IconActionButton
                            icon={Edit2}
                            variant="edit"
                            ariaLabel="Edit"
                            onClick={() => startEdit(cat)}
                          />
                          <IconActionButton
                            icon={Trash2}
                            variant="delete"
                            ariaLabel="Delete"
                            onClick={() => openDeleteModal(cat.id, cat.name)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={page}
              pageCount={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-red-50 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Category?</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>?<br />
              This action <span className="text-red-600 font-medium">cannot be undone</span>.
            </p>
            <div className="flex gap-3">
              <FormButton
                variant="danger"
                onClick={confirmDelete}
                loading={formLoading}
                loadingText="Deleting..."
              >
                Delete
              </FormButton>
              <FormButton
                variant="secondary"
                onClick={closeDeleteModal}
                disabled={formLoading}
              >
                Cancel
              </FormButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
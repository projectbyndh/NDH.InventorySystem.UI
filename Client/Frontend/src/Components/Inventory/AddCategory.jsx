// src/components/Inventory/CategoryForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Hash,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  Settings,
  Tag,
} from "lucide-react";
import CategoryService from "../Api/Categoryapi";
import useUnitOfMeasureStore from "../Store/Unitofmeasurement";
import Spinner from "../Ui/Spinner";
import FormButton from "../Ui/FormButton";
import Button from "../Ui/Button";
import IconActionButton from "../Ui/IconActionButton";

const required = <span className="text-red-500">*</span>;

export default function CategoryForm({ initial = {}, onSaved, onCancel }) {
  const isEditing = !!initial?.id || !!initial?.categoryId;
  const editingId = initial?.id ?? initial?.categoryId;

  const { units = [], fetchUnits, loading: unitsLoading } = useUnitOfMeasureStore();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [name, setName] = useState(initial.name ?? "");
  const [code, setCode] = useState(initial.code ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial.imageUrl ?? "");
  const [preview, setPreview] = useState(initial.imageUrl ?? "");
  const [parentCategoryId, setParentCategoryId] = useState(
    initial.parentCategoryId != null ? String(initial.parentCategoryId) : ""
  );
  const [hasVariants, setHasVariants] = useState(!!initial.hasVariants);
  const [requiresSerialNumbers, setRequiresSerialNumbers] = useState(
    !!initial.requiresSerialNumbers
  );
  const [trackExpiration, setTrackExpiration] = useState(!!initial.trackExpiration);
  const [defaultUnitOfMeasure, setDefaultUnitOfMeasure] = useState(
    initial.defaultUnitOfMeasure ?? ""
  );
  const [taxonomyPath, setTaxonomyPath] = useState(initial.taxonomyPath ?? "");
  const [hierarchyLevel, setHierarchyLevel] = useState(
    Number.isFinite(initial.hierarchyLevel) ? Number(initial.hierarchyLevel) : 1
  );

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [parentOptions, setParentOptions] = useState([
    { value: "", label: "None (Top-level / Root)" },
  ]);
  const [loadingParents, setLoadingParents] = useState(true);

  const fileInputRef = useRef(null);

  // ── Load units of measure ────────────────────────────────────────────────────
  useEffect(() => {
    fetchUnits?.({ pageNumber: 1, pageSize: 100 });
  }, [fetchUnits]);

  // ── Unit dropdown options ────────────────────────────────────────────────────
  const unitOptions = useMemo(() => {
    const opts = units
      .filter((u) => u?.id && u?.name)
      .map((u) => ({
        value: u.name,
        label: `${u.name}${u.symbol ? ` (${u.symbol})` : ""}`.trim(),
      }));
    return [{ value: "", label: "None" }, ...opts];
  }, [units]);

  // ── Load parent categories ───────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingParents(true);
      try {
        const res = await CategoryService.getAll({ pageNumber: 1, pageSize: 100 });
        const items = res?.items ?? res?.data ?? res ?? [];

        const options = items
          .filter((c) => c?.id || c?.categoryId)
          .map((c) => ({
            value: String(c.id ?? c.categoryId),
            label: c.name || `Category #${c.id ?? c.categoryId}`,
          }));

        if (mounted) {
          setParentOptions([{ value: "", label: "None (Top-level / Root)" }, ...options]);
        }
      } catch {
        if (mounted) setError("Could not load parent categories");
      } finally {
        if (mounted) setLoadingParents(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ── Image handling ───────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB");
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setImageUrl(dataUrl);
    } catch {
      setError("Failed to process image");
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || null,
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
        parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null,
        hasVariants,
        requiresSerialNumbers,
        trackExpiration,
        defaultUnitOfMeasure: defaultUnitOfMeasure.trim() || null,
        taxonomyPath: taxonomyPath.trim() || null,
        hierarchyLevel: Number(hierarchyLevel) || 1,
        subCategories: null,   // explicitly null — matches your working Swagger example
      };

      let result;
      if (isEditing) {
        result = await CategoryService.update(editingId, payload);
      } else {
        result = await CategoryService.create(payload);
      }

      setSuccess(true);
      onSaved?.(result);
    } catch (err) {
      const msg =
        err?.response?.data?._message ||
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to save category. Check server logs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-9">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-50 rounded-xl">
              <Package className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Edit Category" : "Create Category"}
              </h1>
              <p className="text-slate-600 text-sm mt-0.5">
                Fill in the category details
              </p>
            </div>
          </div>
          <Link
            to="/inventory/category-rdu"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Tag className="w-4 h-4" />
            View All
          </Link>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Category saved successfully!</span>
          </div>
        )}

        {/* Basic Information */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-600" />
            Basic Information
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category Name {required}
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  placeholder="e.g. Beverages"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Code (optional)</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  placeholder="e.g. BEV001"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none resize-y min-h-[100px]"
              placeholder="All types of drinks including soft drinks, juices, and water."
            />
          </div>
        </section>

        {/* Advanced settings */}
        <section className="pt-6 border-t border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            Advanced Settings
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">Has Variants</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={trackExpiration}
                onChange={(e) => setTrackExpiration(e.target.checked)}
                className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">Track Expiration</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={requiresSerialNumbers}
                onChange={(e) => setRequiresSerialNumbers(e.target.checked)}
                className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">Requires Serial Numbers</span>
            </label>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Default Unit of Measure
              </label>
              <select
                value={defaultUnitOfMeasure}
                onChange={(e) => setDefaultUnitOfMeasure(e.target.value)}
                disabled={unitsLoading}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none bg-white"
              >
                {unitOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Parent Category
              </label>
              <select
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(e.target.value)}
                disabled={loadingParents}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none bg-white"
              >
                {parentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Taxonomy Path (optional)
              </label>
              <input
                value={taxonomyPath}
                onChange={(e) => setTaxonomyPath(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                placeholder="e.g. Food/Beverages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Hierarchy Level
              </label>
              <input
                type="number"
                min="1"
                value={hierarchyLevel}
                onChange={(e) => setHierarchyLevel(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="pt-6 border-t border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-slate-600" />
            Category Image (optional)
          </h2>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Preview box */}
            <div className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative">
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <IconActionButton
                    icon={X}
                    variant="delete"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2 rounded-full !p-1.5"
                  />
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <Upload size={28} className="mx-auto mb-2" />
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Upload Image (max 2MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Or paste image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreview(e.target.value.trim());
                  }}
                  placeholder="https://example.com/images/beverages.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
          <FormButton
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Saving..."
            className="flex-1"
          >
            {isEditing ? "Update Category" : "Create Category"}
          </FormButton>

          {onCancel && (
            <FormButton
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
              className="px-10"
            >
              Cancel
            </FormButton>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
// src/components/Inventory/CategoryForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryService from "../Api/Categoryapi";
import useUnitOfMeasureStore from "../Store/Unitofmeasurement";
import { Link } from "react-router-dom";
import {
  Package,
  Hash,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  X,
  Layers,
  Settings,
  Tag,
} from "lucide-react";
import Spinner from "../UI/Spinner";
import { handleError } from "../UI/errorHandler";

const required = <span className="text-red-500">*</span>;

export default function CategoryForm({ initial, onSaved, onCancel }) {
  const editingId = initial?.id ?? initial?.categoryId;

  const { units = [], fetchUnits, loading: unitsLoading } = useUnitOfMeasureStore();

  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [preview, setPreview] = useState(initial?.imageUrl ?? "");
  const [parentCategoryId, setParentCategoryId] = useState(
    initial?.parentCategoryId == null ? "0" : String(initial.parentCategoryId)
  );
  const [hasVariants, setHasVariants] = useState(!!initial?.hasVariants);
  const [requiresSerialNumbers, setRequiresSerialNumbers] = useState(!!initial?.requiresSerialNumbers);
  const [trackExpiration, setTrackExpiration] = useState(!!initial?.trackExpiration);
  const [defaultUnitOfMeasure, setDefaultUnitOfMeasure] = useState(initial?.defaultUnitOfMeasure ?? "");
  const [taxonomyPath, setTaxonomyPath] = useState(initial?.taxonomyPath ?? "");
  const [hierarchyLevel, setHierarchyLevel] = useState(
    Number.isFinite(initial?.hierarchyLevel) ? Number(initial?.hierarchyLevel) : 1
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [parentOptions, setParentOptions] = useState([{ value: "0", label: "None (Top-level)" }]);
  const [loadingParents, setLoadingParents] = useState(true);
  const fileInputRef = useRef(null);

  // Load Units
  useEffect(() => {
    fetchUnits?.({ pageNumber: 1, pageSize: 100 });
  }, [fetchUnits]);

  // Unit Options
  const unitOptions = useMemo(() => {
    const opts = units
      .filter((u) => u?.id && u?.name)
      .map((u) => ({
        value: u.name,
        label: `${u.name} (${u.symbol || ""})`.trim(),
      }));
    return [{ value: "", label: "None" }, ...opts];
  }, [units]);

  // Load Parent Categories
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingParents(true);
      try {
        const data = await CategoryService.getAll({ pageNumber: 1, pageSize: 100 });
        if (!mounted) return;
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        const options = list
          .filter((c) => c && (c.id || c.categoryId))
          .map((c) => ({
            value: String(c.id ?? c.categoryId),
            label: c.name || `Category ${c.id ?? c.categoryId}`,
          }));
        setParentOptions([
          { value: "0", label: "None (Top-level)" },
          ...options,
        ]);
      } catch (e) {
        if (mounted) {
          handleError(e, { title: "Failed to load parent categories" });
          setError("Could not load parent categories.");
        }
      } finally {
        if (mounted) setLoadingParents(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Image Handlers
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be < 2MB");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(URL.createObjectURL(file));
      setImageUrl(dataUrl);
    } catch (err) {
      handleError(err, { title: "Failed to read image" });
      setError("Failed to read image");
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onTypeImageUrl = (url) => {
    setImageUrl(url);
    setPreview(url || "");
  };

  // Validation
  const validate = () => {
    if (!name.trim()) return "Category name is required";
    return null;
  };

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || null,
        description: description.trim() || null,
        imageUrl: imageUrl || null,
        parentCategoryId: parentCategoryId === "0" ? null : Number(parentCategoryId),
        hasVariants,
        requiresSerialNumbers,
        trackExpiration,
        defaultUnitOfMeasure: defaultUnitOfMeasure || null,
        taxonomyPath: taxonomyPath.trim() || null,
        hierarchyLevel,
      };

      let result;
      if (editingId) {
        result = await CategoryService.update(editingId, payload);
      } else {
        result = await CategoryService.create(payload);
      }

      setSuccess(true);
      onSaved?.(result);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      handleError(err, { title: "Failed to save category" });
      const msg =
        err?.response?.data?._message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to save category";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-50 rounded-xl">
              <Package className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {editingId ? "Edit Category" : "Add New Category"}
              </h1>
              <p className="text-slate-600 text-sm">Fill in the details below</p>
            </div>
          </div>
          <Link
            to="/inventory/category-rdu"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Tag className="w-4 h-4" />
            View All Categories
          </Link>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Category saved successfully!</span>
          </div>
        )}

        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-600" />
            Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Category Name {required}
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                  placeholder="e.g. Electronics"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Code</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                  placeholder="e.g. ELEC-001"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Description
          </h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
            placeholder="Optional description..."
          />
        </section>

        {/* Image */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-slate-600" />
            Category Image
          </h2>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 w-24 rounded-xl object-cover border-2 border-slate-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickImage}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
                <p className="mt-1 text-xs text-slate-500">Max 2MB, JPG/PNG</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">or</span>
                <input
                  value={imageUrl}
                  onChange={(e) => onTypeImageUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hierarchy & Unit */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-600" />
            Hierarchy & Unit
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Parent Category</label>
              {loadingParents ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <Spinner size={4} className="inline-block" />
                  Loading...
                </div>
              ) : (
                <select
                  value={parentCategoryId}
                  onChange={(e) => setParentCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                >
                  {parentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Default Unit of Measure</label>
              {unitsLoading ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Spinner size={4} className="inline-block" />
                    Loading units...
                  </div>
              ) : (
                <select
                  value={defaultUnitOfMeasure}
                  onChange={(e) => setDefaultUnitOfMeasure(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                >
                  {unitOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Taxonomy Path</label>
              <input
                value={taxonomyPath}
                onChange={(e) => setTaxonomyPath(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. root/electronics/phones"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Hierarchy Level</label>
              <input
                type="number"
                min="0"
                value={hierarchyLevel}
                onChange={(e) => setHierarchyLevel(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            Inventory Settings
          </h2>
          <div className="flex flex-wrap gap-6">
            {[
              { key: "hasVariants", label: "Has Variants" },
              { key: "requiresSerialNumbers", label: "Requires Serial Numbers" },
              { key: "trackExpiration", label: "Track Expiration" },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    item.key === "hasVariants"
                      ? hasVariants
                      : item.key === "requiresSerialNumbers"
                      ? requiresSerialNumbers
                      : trackExpiration
                  }
                  onChange={() => {
                    if (item.key === "hasVariants") setHasVariants((v) => !v);
                    else if (item.key === "requiresSerialNumbers") setRequiresSerialNumbers((v) => !v);
                    else setTrackExpiration((v) => !v);
                  }}
                  className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
                />
                <span className="text-slate-700 font-medium">{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {editingId ? "Update Category" : "Create Category"}
              </>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3.5 border-2 border-slate-300 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
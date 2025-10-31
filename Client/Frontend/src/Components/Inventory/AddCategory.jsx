// src/Components/Inventory/CategoryForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryService from "../Api/Categoryapi";

const required = <span className="text-red-500">*</span>;

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-[15px] outline-none focus:ring-2 focus:ring-slate-900/5 " +
        (props.className || "")
      }
    />
  );
}
function Textarea(props) {
  return (
    <textarea
      {...props}
      rows={3}
      className={
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-slate-900/5 " +
        (props.className || "")
      }
    />
  );
}

function Select({ value, onChange, options, placeholder = "Choose one", disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const f = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);
  const current = useMemo(() => options.find((o) => String(o.value) === String(value)), [options, value]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-10 px-3 rounded-xl border bg-white border-slate-300 text-left text-[15px] flex items-center justify-between ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={current ? "text-slate-900" : "text-slate-400"}>
          {current ? current.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 1.04 1.08l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.31a.75.75 0 0 1 .02-1.1z" />
        </svg>
      </button>
      {open && !disabled && (
        <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((o) => (
            <li
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer text-[15px] hover:bg-slate-50 ${
                String(o.value) === String(value) ? "bg-slate-50" : ""
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────────────────────────────────────
export default function CategoryForm({ initial, onSaved, onCancel }) {
  const editingId = initial?.id ?? initial?.categoryId;

  // ── Form State ────────────────────────────────────────────────────────────
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [preview, setPreview] = useState(initial?.imageUrl ?? "");
  const [parentCategoryId, setParentCategoryId] = useState(String(initial?.parentCategoryId ?? "0"));
  const [hasVariants, setHasVariants] = useState(!!initial?.hasVariants);
  const [requiresSerialNumbers, setRequiresSerialNumbers] = useState(!!initial?.requiresSerialNumbers);
  const [trackExpiration, setTrackExpiration] = useState(!!initial?.trackExpiration);
  const [defaultUnitOfMeasure, setDefaultUnitOfMeasure] = useState(initial?.defaultUnitOfMeasure ?? "");
  const [taxonomyPath, setTaxonomyPath] = useState(initial?.taxonomyPath ?? "");
  const [hierarchyLevel, setHierarchyLevel] = useState(
    Number.isFinite(initial?.hierarchyLevel) ? Number(initial?.hierarchyLevel) : 0
  );

  // Subcategories: full DTOs
  const [subCategories, setSubCategories] = useState(
    Array.isArray(initial?.subCategories)
      ? initial.subCategories.map((s) => ({
          name: s.name ?? (typeof s === "string" ? s : ""),
          description: s.description ?? "",
        }))
      : []
  );

  // ── UI State ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parentOptions, setParentOptions] = useState([{ value: "0", label: "None (Top-level)" }]);
  const [loadingParents, setLoadingParents] = useState(true); // start as true

  // ── Options ───────────────────────────────────────────────────────────────
  const unitOptions = useMemo(
    () => [
      { value: "", label: "None" },
      { value: "pcs", label: "Piece" },
      { value: "kg", label: "Kilogram" },
      { value: "g", label: "Gram" },
      { value: "ltr", label: "Liter" },
      { value: "box", label: "Box" },
    ],
    []
  );

  // ── Load Parents (Robust) ─────────────────────────────────────────────────
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
          console.warn("Failed to load parent categories:", e);
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

  // ── Image Helpers ─────────────────────────────────────────────────────────
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
    } catch {
      setError("Failed to read image");
    }
  };

  const onTypeImageUrl = (url) => {
    setImageUrl(url);
    setPreview(url || "");
  };

  // ── Subcategory Management ────────────────────────────────────────────────
  const addSubcategory = () => {
    setSubCategories((prev) => [...prev, { name: "", description: "" }]);
  };

  const updateSubcategory = (index, field, value) => {
    setSubCategories((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const removeSubcategory = (index) => {
    setSubCategories((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!name.trim()) return "Category name is required";
    if (subCategories.some((s) => !s.name.trim())) return "All subcategories must have a name";
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageUrl || undefined,
        parentCategoryId: parentCategoryId === "0" ? undefined : Number(parentCategoryId),
        hasVariants,  
        requiresSerialNumbers,
        trackExpiration,
        defaultUnitOfMeasure: defaultUnitOfMeasure || undefined,
        taxonomyPath: taxonomyPath.trim() || undefined,
        hierarchyLevel,
        subCategories: subCategories
          .filter((s) => s.name.trim())
          .map((s) => ({
            name: s.name.trim(),
            description: s.description.trim() || undefined,
          })),
      };

      const result = editingId
        ? await CategoryService.update(editingId, payload)
        : await CategoryService.create(payload);

      onSaved?.(result);
    } catch (err) {
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Name & Code */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">
            Category Name {required}
          </div>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Code</div>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
      </div>

      {/* Description */}
      <label className="block">
        <div className="mb-1 text-[13px] font-medium text-slate-700">Description</div>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      {/* Image */}
      <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="mb-1 text-[13px] font-medium text-slate-700">Upload Image</div>
            <input type="file" accept="image/*" onChange={onPickImage} className="block w-full text-sm" />
          </label>
          <label className="block">
            <div className="mb-1 text-[13px] font-medium text-slate-700">or Image URL</div>
            <Input value={imageUrl} onChange={(e) => onTypeImageUrl(e.target.value)} />
          </label>
        </div>
        {preview && (
          <img src={preview} alt="Preview" className="h-24 w-24 rounded-lg border object-cover" />
        )}
      </div>

      {/* Parent & Unit */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Parent Category</div>
          <Select
            options={parentOptions}
            value={parentCategoryId}
            onChange={setParentCategoryId}
            placeholder={loadingParents ? "Loading categories..." : "None"}
            disabled={loadingParents}
          />
        </label>
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Unit of Measure</div>
          <Select
            options={unitOptions}
            value={defaultUnitOfMeasure}
            onChange={setDefaultUnitOfMeasure}
          />
        </label>
      </div>

      {/* Taxonomy & Level */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Taxonomy Path</div>
          <Input value={taxonomyPath} onChange={(e) => setTaxonomyPath(e.target.value)} />
        </label>
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Hierarchy Level</div>
          <Input
            type="number"
            min={0}
            value={hierarchyLevel}
            onChange={(e) => setHierarchyLevel(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Subcategories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-medium text-slate-700">Subcategories</div>
          <button
            type="button"
            onClick={addSubcategory}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            + Add
          </button>
        </div>
        {subCategories.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Click "+ Add" to create a subcategory</p>
        ) : (
          subCategories.map((sub, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                placeholder="Subcategory name"
                value={sub.name}
                onChange={(e) => updateSubcategory(idx, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Description (optional)"
                value={sub.description}
                onChange={(e) => updateSubcategory(idx, "description", e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSubcategory(idx)}
                className="mt-1 text-red-600 hover:text-red-800 text-lg"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hasVariants} onChange={() => setHasVariants((v) => !v)} />
          Has Variants
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={requiresSerialNumbers}
            onChange={() => setRequiresSerialNumbers((v) => !v)}
          />
          Requires Serial Numbers
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={trackExpiration}
            onChange={() => setTrackExpiration((v) => !v)}
          />
          Track Expiration
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-5 py-2 text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
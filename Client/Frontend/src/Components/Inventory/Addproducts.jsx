import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../Store/Productstore";
import useCategoryStore from "../Store/Categorystore";
import useVendorStore from "../Store/Vendorstore";
import useUnitOfMeasureStore from "../Store/Unitofmeasurement";
import {
  Plus,
  Trash2,
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Package,
  DollarSign,
  Tag,
  Box,
  Hash,
  Info,
  Layers,
  Settings,
} from "lucide-react";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Stores
  const { createProduct, updateProduct, fetchProductById } = useProductStore();
  const { categories = [], fetchCategories } = useCategoryStore();
  const { vendors = [], fetchVendors } = useVendorStore();
  const { units = [], fetchUnits } = useUnitOfMeasureStore();

  // ----------------------------------------------------------------------
  // Form state
  // ----------------------------------------------------------------------
  const initialForm = {
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    quantityInStock: 0,
    minimumStockLevel: 0,
    reorderQuantity: 0,
    categoryId: 0,
    subCategoryId: null,           // ← null instead of 0
    unitOfMeasureId: null,         // ← null for "None"
    primaryVendorId: null,         // ← null for "None"
    status: "Active",
    trackInventory: true,
    isSerialized: false,
    hasExpiry: false,
    variantGroupId: "",
    variants: [],
    attributes: [],
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const nameInputRef = useRef(null);

  // ----------------------------------------------------------------------
  // Load dropdown data
  // ----------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setDataLoading(true);
      await Promise.allSettled([
        fetchCategories(),
        fetchVendors(),
        fetchUnits?.({ pageNumber: 1, pageSize: 100 }),
      ]);
      setDataLoading(false);
    };
    load();
  }, [fetchCategories, fetchVendors, fetchUnits]);

  // ----------------------------------------------------------------------
  // Load product when editing
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (isEdit && id) {
      const load = async () => {
        setLoading(true);
        try {
          const p = await fetchProductById(parseInt(id));
          setForm({
            ...p,
            categoryId: p.categoryId || 0,
            subCategoryId: p.subCategoryId ?? null,           // ← preserve null
            unitOfMeasureId: p.unitOfMeasureId ?? null,       // ← preserve null
            primaryVendorId: p.primaryVendorId ?? null,       // ← preserve null
            variantGroupId: p.variantGroupId || "",
            variants:
              (p.variants || []).map((v) => ({
                ...v,
                attributesJson:
                  typeof v.attributesJson === "object"
                    ? JSON.stringify(v.attributesJson, null, 2)
                    : v.attributesJson || "{}",
              })) ?? [],
            attributes: p.attributes || [],
          });
        } catch {
          alert("Product not found");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id, isEdit, fetchProductById]);

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleVariantChange = (idx, field, value) => {
    const newVariants = [...form.variants];
    newVariants[idx] = { ...newVariants[idx], [field]: value };
    setForm({ ...form, variants: newVariants });
  };

  const handleAttributeChange = (idx, field, value) => {
    const newAttrs = [...form.attributes];
    newAttrs[idx] = { ...newAttrs[idx], [field]: value };
    setForm({ ...form, attributes: newAttrs });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        { name: "", sku: "", price: 0, stockQuantity: 0, attributesJson: "{}" },
      ],
    });
  };

  const removeVariant = (idx) => {
    const newVariants = form.variants.filter((_, i) => i !== idx);
    setForm({
      ...form,
      variants: newVariants,
      variantGroupId: newVariants.length === 0 ? "" : form.variantGroupId,
    });
  };

  const addAttribute = () => {
    setForm({
      ...form,
      attributes: [...form.attributes, { name: "", value: "" }],
    });
  };

  const removeAttribute = (idx) => {
    setForm({
      ...form,
      attributes: form.attributes.filter((_, i) => i !== idx),
    });
  };

  // ----------------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------------
  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name required";
    if (!form.sku?.trim()) e.sku = "SKU required";
    if (form.price <= 0) e.price = "Price must be > 0";
    if (!form.categoryId || form.categoryId === 0) e.categoryId = "Select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ----------------------------------------------------------------------
  // Submit – send null for optional FKs
  // ----------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccess(false);
    setErrors({});

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        sku: form.sku.trim(),
        price: parseFloat(form.price) || 0,
        cost: parseFloat(form.cost) || 0,
        quantityInStock: parseInt(form.quantityInStock, 10) || 0,
        minimumStockLevel: parseInt(form.minimumStockLevel, 10) || 0,
        reorderQuantity: parseInt(form.reorderQuantity, 10) || 0,
        categoryId: parseInt(form.categoryId, 10),
        status: form.status,
        trackInventory: !!form.trackInventory,
        isSerialized: !!form.isSerialized,
        hasExpiry: !!form.hasExpiry,
      };

      // Optional FKs → null if not selected
      payload.subCategoryId = form.subCategoryId ?? null;
      payload.unitOfMeasureId = form.unitOfMeasureId ?? null;
      payload.primaryVendorId = form.primaryVendorId ?? null;

      // Variants
      const validVariants = form.variants
        .filter((v) => v.sku?.trim() || v.name?.trim())
        .map((v) => ({
          name: v.name?.trim() || null,
          sku: v.sku?.trim() || null,
          price: parseFloat(v.price) || 0,
          stockQuantity: parseInt(v.stockQuantity, 10) || 0,
          attributesJson: v.attributesJson?.trim() || null,
        }));
      payload.variants = validVariants.length > 0 ? validVariants : null;

      // Attributes
      const validAttrs = form.attributes
        .filter((a) => a.name?.trim() && a.value?.trim())
        .map((a) => ({ name: a.name.trim(), value: a.value.trim() }));
      payload.attributes = validAttrs.length > 0 ? validAttrs : null;

      // Variant Group ID
      if (validVariants.length > 0 && form.variantGroupId?.trim()) {
        payload.variantGroupId = form.variantGroupId.trim();
      }

      console.log("FINAL PAYLOAD →", JSON.stringify(payload, null, 2));

      if (isEdit) {
        await updateProduct(parseInt(id), payload);
      } else {
        await createProduct(payload);
      }

      setSuccess(true);
      setTimeout(() => navigate("/inventory/product-crud"), 1200);
    } catch (err) {
      const message =
        err?.response?.data?._message ||
        err?.message ||
        "An error occurred. Please try again.";
      setErrors({ submit: message });
      console.error("Product save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // Loading UI
  // ----------------------------------------------------------------------
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-slate-600" />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN UI
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl bg-white shadow hover:shadow-md transition"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEdit ? "Edit" : "Add"} Product
            </h1>
            <p className="text-slate-600">Fill in product details</p>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
            <CheckCircle className="w-6 h-6" />
            Product saved successfully!
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* BASIC INFORMATION */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-slate-700" /> Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Name *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      ref={nameInputRef}
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.name ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-slate-500 transition`}
                      placeholder="Product name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    SKU *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      value={form.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.sku ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-slate-500 transition`}
                      placeholder="Unique SKU"
                    />
                  </div>
                  {errors.sku && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.sku}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.price ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-slate-500 transition`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Cost
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) => handleChange("cost", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => handleChange("categoryId", parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                  >
                    <option value={0}>Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                {/* Sub Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Sub Category
                  </label>
                  <select
                    value={form.subCategoryId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("subCategoryId", val === "" ? null : Number(val));
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                  >
                    <option value="">None</option>
                    {/* Add subcategories when available */}
                  </select>
                </div>

                {/* Unit of Measure */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Unit of Measure
                  </label>
                  <select
                    value={form.unitOfMeasureId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("unitOfMeasureId", val === "" ? null : Number(val));
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                  >
                    <option value="">None</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Vendor */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Primary Vendor
                  </label>
                  <select
                    value={form.primaryVendorId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("primaryVendorId", val === "" ? null : Number(val));
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                  >
                    <option value="">None</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant Group ID */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Variant Group ID (optional)
                  </label>
                  <input
                    value={form.variantGroupId}
                    onChange={(e) => handleChange("variantGroupId", e.target.value)}
                    placeholder="e.g. MACBOOK-PRO-16"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                  />
                </div>
              </div>
            </section>

            {/* INVENTORY & STOCK */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Box className="w-6 h-6 text-slate-700" /> Inventory & Stock
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={form.quantityInStock}
                    onChange={(e) => handleChange("quantityInStock", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    value={form.minimumStockLevel}
                    onChange={(e) => handleChange("minimumStockLevel", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Reorder Quantity
                  </label>
                  <input
                    type="number"
                    value={form.reorderQuantity}
                    onChange={(e) => handleChange("reorderQuantity", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-6 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.trackInventory}
                    onChange={(e) => handleChange("trackInventory", e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                  />
                  <span className="text-slate-700 font-medium">Track Inventory</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSerialized}
                    onChange={(e) => handleChange("isSerialized", e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                  />
                  <span className="text-slate-700 font-medium">Serialized</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasExpiry}
                    onChange={(e) => handleChange("hasExpiry", e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                  />
                  <span className="text-slate-700 font-medium">Has Expiry Date</span>
                </label>
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-slate-700" /> Description
              </h2>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 transition"
                placeholder="Product description (optional)"
              />
            </section>

            {/* PRODUCT VARIANTS */}
            <section className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-slate-700" /> Product Variants
                </h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  <Plus className="w-4 h-4" /> Add Variant
                </button>
              </div>
              {form.variants.length === 0 ? (
                <p className="text-slate-500 italic">No variants added</p>
              ) : (
                <div className="space-y-6">
                  {form.variants.map((variant, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-slate-800">Variant {i + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          placeholder="Variant Name"
                          value={variant.name}
                          onChange={(e) => handleVariantChange(i, "name", e.target.value)}
                          className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                        />
                        <input
                          placeholder="Variant SKU"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(i, "sku", e.target.value)}
                          className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                          className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(i, "stockQuantity", e.target.value)}
                          className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Attributes JSON *
                        </label>
                        <textarea
                          value={variant.attributesJson}
                          onChange={(e) => handleVariantChange(i, "attributesJson", e.target.value)}
                          rows={3}
                          className="w-full p-3 font-mono text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                          placeholder='{"Storage":"512GB","Color":"Space Gray"}'
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Must be valid JSON string
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* CUSTOM ATTRIBUTES */}
            <section className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-700" /> Custom Attributes
                </h2>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  <Plus className="w-4 h-4" /> Add Attribute
                </button>
              </div>
              {form.attributes.length === 0 ? (
                <p className="text-slate-500 italic">No custom attributes</p>
              ) : (
                <div className="space-y-3">
                  {form.attributes.map((attr, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <input
                        placeholder="Key"
                        value={attr.name}
                        onChange={(e) => handleAttributeChange(i, "name", e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                      />
                      <input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(i, "value", e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttribute(i)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SUBMIT */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {errors.submit}
              </div>
            )}
            <div className="flex gap-4 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:bg-black disabled:opacity-50 transition"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>{isEdit ? "Update" : "Create"} Product</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
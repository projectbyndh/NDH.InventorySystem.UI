// src/Components/Inventory/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useProductStore from "../Store/Productstore";
import useCategoryStore from "../Store/Categorystore";
import useVendorStore from "../Store/Vendorstore";
import useUnitOfMeasureStore from "../Store/Unitofmeasurement";
import {
  Trash2,
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
import Spinner from "../Ui/Spinner";
import { handleError } from "../Ui/errorHandler";
import FormButton from "../Ui/FormButton";
import BackButton from "../Ui/BackButton";
import Button from "../Ui/Button";
import IconActionButton from "../Ui/IconActionButton";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { createProduct, updateProduct, fetchProductById } = useProductStore();
  const { categories = [], fetchCategories } = useCategoryStore();
  const { vendors = [], fetchVendors } = useVendorStore();
  const { units = [], fetchUnits } = useUnitOfMeasureStore();

  const initialForm = {
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    quantityInStock: 0,
    minimumStockLevel: 0,
    reorderQuantity: 0,
    categoryId: "",               // empty = not selected → will send 0
    subCategoryId: null,
    unitOfMeasureId: null,
    primaryVendorId: null,
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
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Load dropdown data
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

  // Load product for edit
  useEffect(() => {
    if (isEdit && id) {
      const load = async () => {
        setLoading(true);
        try {
          const p = await fetchProductById(parseInt(id));
          setForm({
            ...p,
            categoryId: p.categoryId ?? "",
            subCategoryId: p.subCategoryId ?? null,
            unitOfMeasureId: p.unitOfMeasureId ?? null,
            primaryVendorId: p.primaryVendorId ?? null,
            variantGroupId: p.variantGroupId || "",
            variants: (p.variants || []).map((v) => ({
              ...v,
              attributesJson:
                typeof v.attributesJson === "object"
                  ? JSON.stringify(v.attributesJson, null, 2)
                  : v.attributesJson || "{}",
            })),
            attributes: p.attributes || [],
          });
        } catch (err) {
          handleError(err, { title: "Product load failed" });
          alert("Product not found");
          navigate("/inventory/product-crud");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id, isEdit, fetchProductById, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleVariantChange = (idx, field, value) => {
    const newVariants = [...form.variants];
    newVariants[idx][field] = value;
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", sku: "", price: 0, stockQuantity: 0, attributesJson: "{}" },
      ],
    }));
  };

  const removeVariant = (idx) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleAttributeChange = (idx, field, value) => {
    const newAttrs = [...form.attributes];
    newAttrs[idx][field] = value;
    setForm((prev) => ({ ...prev, attributes: newAttrs }));
  };

  const addAttribute = () => {
    setForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", value: "" }],
    }));
  };

  const removeAttribute = (idx) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== idx),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.sku?.trim()) e.sku = "SKU is required";
    if (form.price <= 0) e.price = "Price must be greater than 0";

    // Category is mandatory
    if (!form.categoryId || isNaN(Number(form.categoryId)) || Number(form.categoryId) <= 0) {
      e.categoryId = "Please select a valid category";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

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

        categoryId: form.categoryId && !isNaN(Number(form.categoryId))
          ? Number(form.categoryId)
          : 0,

        subCategoryId: form.subCategoryId ? Number(form.subCategoryId) : 0,
        unitOfMeasureId: form.unitOfMeasureId ? Number(form.unitOfMeasureId) : 0,
        primaryVendorId: form.primaryVendorId ? Number(form.primaryVendorId) : 0,
        status: form.status,
        trackInventory: !!form.trackInventory,
        isSerialized: !!form.isSerialized,
        hasExpiry: !!form.hasExpiry,
        variantGroupId: form.variantGroupId?.trim() || null,
      };

      payload.variants = form.variants
        .filter((v) => v.name?.trim() || v.sku?.trim())
        .map((v) => ({
          name: v.name?.trim() || null,
          sku: v.sku?.trim() || null,
          price: parseFloat(v.price) || 0,
          stockQuantity: parseInt(v.stockQuantity, 10) || 0,
          attributesJson: v.attributesJson?.trim() || null,
        }));

      payload.attributes = form.attributes
        .filter((a) => a.name?.trim() && a.value?.trim())
        .map((a) => ({
          name: a.name.trim(),
          value: a.value.trim(),
        }));

      console.log("Submitting product payload:", JSON.stringify(payload, null, 2));

      if (isEdit) {
        await updateProduct(parseInt(id), payload);
      } else {
        await createProduct(payload);
      }

      setSuccess(true);
      setTimeout(() => navigate("/inventory/product-crud"), 1500);
    } catch (err) {
      handleError(err, { title: "Failed to save product" });

      const serverErrors = err?.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const mapped = {};
        Object.entries(serverErrors).forEach(([key, msgs]) => {
          const k = key.toLowerCase();
          const message = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
          if (k === "sku") mapped.sku = message;
          else if (k === "name") mapped.name = message;
          else mapped[key] = message;
        });
        // show field errors inline and also a submit summary
        setErrors((prev) => ({ ...prev, ...mapped, submit: Object.values(mapped).join(" ") }));
      } else {
        const message = err?.response?.data?._message || err?.message || "Failed to save product.";
        setErrors({ submit: message });
      }

      // helpful console output for server-side debug
      console.error("Save product error response:", err?.response?.data ?? err);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={12} className="mx-auto mb-4 text-sky-600" />
          <p className="text-slate-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton onClick={() => navigate(-1)} />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-slate-600 mt-1">Complete all required fields</p>
            </div>
          </div>
          <Link
            to="/inventory/product-crud"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Package className="w-4 h-4" />
            View All Products
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Product saved successfully!</p>
              <p className="text-sm">Redirecting to product list...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-slate-700" />
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-300"
                        } focus:ring-2 focus:ring-sky-500 transition-shadow`}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      value={form.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.sku ? "border-red-500" : "border-slate-300"
                        } focus:ring-2 focus:ring-sky-500 transition-shadow`}
                      placeholder="e.g. PROD-001"
                      required
                    />
                  </div>
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.sku}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.price ? "border-red-500" : "border-slate-300"
                        } focus:ring-2 focus:ring-sky-500 transition-shadow`}
                      placeholder="0.00"
                      required
                      min="0.01"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.price}
                    </p>
                  )}
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Cost</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) => handleChange("cost", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.categoryId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange("categoryId", val === "" ? "" : Number(val));
                    }}
                    required
                    className={`w-full px-4 py-3 rounded-xl border appearance-none ${errors.categoryId ? "border-red-500 ring-2 ring-red-200" : "border-slate-300"
                      } focus:ring-2 focus:ring-sky-500 transition-shadow bg-white`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="" disabled>
                      Select a category *
                    </option>
                    {categories.length === 0 ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>

                  {errors.categoryId && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                      <AlertCircle size={16} /> {errors.categoryId}
                    </p>
                  )}
                </div>

                {/* Unit of Measure */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Unit of Measure</label>
                  <select
                    value={form.unitOfMeasureId ?? ""}
                    onChange={(e) =>
                      handleChange("unitOfMeasureId", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
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
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Primary Vendor</label>
                  <select
                    value={form.primaryVendorId ?? ""}
                    onChange={(e) =>
                      handleChange("primaryVendorId", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
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
                    placeholder="e.g. IPHONE-15-PRO"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                  />
                </div>
              </div>
            </section>

            {/* Inventory & Stock */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Box className="w-6 h-6 text-slate-700" />
                Inventory & Stock
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Current Stock</label>
                  <input
                    type="number"
                    value={form.quantityInStock}
                    onChange={(e) => handleChange("quantityInStock", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Min Stock Level</label>
                  <input
                    type="number"
                    value={form.minimumStockLevel}
                    onChange={(e) => handleChange("minimumStockLevel", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Reorder Quantity</label>
                  <input
                    type="number"
                    value={form.reorderQuantity}
                    onChange={(e) => handleChange("reorderQuantity", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-8 flex-wrap">
                {[
                  { key: "trackInventory", label: "Track Inventory" },
                  { key: "isSerialized", label: "Serialized" },
                  { key: "hasExpiry", label: "Has Expiry Date" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.checked)}
                      className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-slate-700" />
                Description
              </h2>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 transition-shadow"
                placeholder="Describe your product (optional)"
              />
            </section>

            {/* Variants */}
            <section className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-slate-700" />
                  Product Variants
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addVariant}
                >
                  Add Variant
                </Button>
              </div>

              {form.variants.length === 0 ? (
                <p className="text-slate-500 italic">No variants added yet.</p>
              ) : (
                <div className="space-y-6">
                  {form.variants.map((v, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-slate-800">Variant {i + 1}</h4>
                        <IconActionButton
                          icon={Trash2}
                          variant="delete"
                          onClick={() => removeVariant(i)}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          placeholder="Name (e.g. Large)"
                          value={v.name}
                          onChange={(e) => handleVariantChange(i, "name", e.target.value)}
                          className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          placeholder="SKU (e.g. PROD-LG)"
                          value={v.sku}
                          onChange={(e) => handleVariantChange(i, "sku", e.target.value)}
                          className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={v.price}
                          onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                          className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={v.stockQuantity}
                          onChange={(e) => handleVariantChange(i, "stockQuantity", e.target.value)}
                          className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Attributes (JSON)
                        </label>
                        <textarea
                          value={v.attributesJson}
                          onChange={(e) => handleVariantChange(i, "attributesJson", e.target.value)}
                          rows={3}
                          className="w-full p-3 font-mono text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                          placeholder='{"color": "Black", "size": "XL"}'
                        />
                        <p className="mt-1 text-xs text-slate-500">Valid JSON object</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Attributes */}
            <section className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-700" />
                  Custom Attributes
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addAttribute}
                >
                  Add Attribute
                </Button>
              </div>

              {form.attributes.length === 0 ? (
                <p className="text-slate-500 italic">No custom attributes added.</p>
              ) : (
                <div className="space-y-3">
                  {form.attributes.map((attr, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <input
                        placeholder="Key (e.g. Material)"
                        value={attr.name}
                        onChange={(e) => handleAttributeChange(i, "name", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                      />
                      <input
                        placeholder="Value (e.g. Cotton)"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(i, "value", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                      />
                      <IconActionButton
                        icon={Trash2}
                        variant="delete"
                        onClick={() => removeAttribute(i)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Error */}
            {errors.submit && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-8 border-t">
              <FormButton
                type="submit"
                variant="primary"
                loading={loading}
                loadingText="Saving..."
              >
                {isEdit ? "Update Product" : "Create Product"}
              </FormButton>

              <FormButton
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
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
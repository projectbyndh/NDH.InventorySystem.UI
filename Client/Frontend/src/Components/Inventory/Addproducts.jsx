// src/components/Inventory/AddProduct.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../Store/Productstore";
import useCategoryStore from "../Store/Categorystore";
import useVendorStore from "../Store/Vendorstore";
import {
  Plus, Trash2, Loader2, ChevronLeft, AlertCircle, CheckCircle,
  Package, DollarSign, Tag, Box, Hash, Info, Edit3
} from "lucide-react";
import React from "react";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { createProduct, updateProduct, fetchProductById } = useProductStore();
  const { categories = [], fetchCategories } = useCategoryStore();
  const { vendors = [], fetchVendors } = useVendorStore();

  const initialForm = {
    name: "", description: "", sku: "", price: 0, cost: 0,
    quantityInStock: 0, minimumStockLevel: 0, reorderQuantity: 0,
    categoryId: 0, subCategoryId: 0, unitOfMeasureId: 0, primaryVendorId: 0,
    status: "Active", trackInventory: true, isSerialized: false, hasExpiry: false,
    variantGroupId: "", variants: [], attributes: []
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setDataLoading(true);
      await Promise.allSettled([fetchCategories(), fetchVendors()]);
      setDataLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const load = async () => {
        setLoading(true);
        try {
          const p = await fetchProductById(parseInt(id));
          setForm({
            ...p,
            categoryId: p.categoryId || 0,
            subCategoryId: p.subCategoryId || 0,
            unitOfMeasureId: p.unitOfMeasureId || 0,
            primaryVendorId: p.primaryVendorId || 0,
            variantGroupId: p.variantGroupId || "",
            variants: p.variants || [],
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
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, {
        name: "", sku: "", price: 0, stockQuantity: 0, attributesJson: "{}"
      }]
    });
  };

  const removeVariant = (i) => {
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });
  };

  const addAttribute = () => {
    setForm({ ...form, attributes: [...form.attributes, { name: "", value: "" }] });
  };

  const removeAttribute = (i) => {
    setForm({ ...form, attributes: form.attributes.filter((_, idx) => idx !== i) });
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name required";
    if (!form.sku?.trim()) e.sku = "SKU required";
    if (form.price <= 0) e.price = "Price > 0";
    if (!form.categoryId) e.categoryId = "Select category";
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
        name: form.name.trim(),
        description: form.description.trim(),
        sku: form.sku.trim(),
        price: parseFloat(form.price) || 0,
        cost: parseFloat(form.cost) || 0,
        quantityInStock: parseInt(form.quantityInStock) || 0,
        minimumStockLevel: parseInt(form.minimumStockLevel) || 0,
        reorderQuantity: parseInt(form.reorderQuantity) || 0,
        categoryId: parseInt(form.categoryId) || 0,
        subCategoryId: parseInt(form.subCategoryId) || 0,
        unitOfMeasureId: parseInt(form.unitOfMeasureId) || 0,
        primaryVendorId: parseInt(form.primaryVendorId) || 0,
        status: form.status,
        trackInventory: !!form.trackInventory,
        isSerialized: !!form.isSerialized,
        hasExpiry: !!form.hasExpiry,
        variantGroupId: form.variantGroupId?.trim() || undefined,
        variants: form.variants
          .filter(v => v.sku?.trim() || v.name?.trim())
          .map(v => ({
            name: v.name?.trim(),
            sku: v.sku?.trim(),
            price: parseFloat(v.price) || 0,
            stockQuantity: parseInt(v.stockQuantity) || 0,
            attributesJson: v.attributesJson?.trim() || "{}"
          })),
        attributes: form.attributes
          .filter(a => a.name?.trim() && a.value?.trim())
          .map(a => ({ name: a.name.trim(), value: a.value.trim() }))
      };

      if (isEdit) {
        await updateProduct(parseInt(id), payload);
      } else {
        await createProduct(payload);
      }

      setSuccess(true);
      setTimeout(() => navigate("/inventory/product-crud"), 1200);
    } catch (err) {
      setErrors({ submit: err.message || "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 rounded-xl bg-white shadow hover:shadow-md">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{isEdit ? "Edit" : "Add"} Product</h1>
            <p className="text-slate-600">Fill in product details</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
            <CheckCircle className="w-6 h-6" /> Product saved!
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* BASIC INFO */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-slate-700" /> Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Name *</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input ref={nameInputRef} value={form.name} onChange={e => handleChange("name", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500`} />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">SKU *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input value={form.sku} onChange={e => handleChange("sku", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.sku ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500`} />
                  </div>
                  {errors.sku && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.sku}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Price *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="number" step="0.01" value={form.price} onChange={e => handleChange("price", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.price ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500`} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Category *</label>
                  <select value={form.categoryId} onChange={e => handleChange("categoryId", parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500">
                    <option value={0}>Select</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* INVENTORY */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Box className="w-6 h-6 text-slate-700" /> Inventory
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <input type="number" placeholder="Stock" value={form.quantityInStock} onChange={e => handleChange("quantityInStock", e.target.value)} className="px-4 py-3 rounded-xl border border-slate-300" />
                <input type="number" placeholder="Min Stock" value={form.minimumStockLevel} onChange={e => handleChange("minimumStockLevel", e.target.value)} className="px-4 py-3 rounded-xl border border-slate-300" />
                <input type="number" placeholder="Reorder Qty" value={form.reorderQuantity} onChange={e => handleChange("reorderQuantity", e.target.value)} className="px-4 py-3 rounded-xl border border-slate-300" />
              </div>
            </section>

            {/* ATTRIBUTES & VARIANTS (same as before) */}
            {/* ... add the rest from previous version ... */}

            {/* SUBMIT */}
            {errors.submit && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{errors.submit}</div>}

            <div className="flex gap-4 pt-8">
              <button type="submit" disabled={loading}
                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:bg-black">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isEdit ? "Update" : "Create"} Product</>}
              </button>
              <button type="button" onClick={() => navigate(-1)}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-4 rounded-xl font-bold text-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
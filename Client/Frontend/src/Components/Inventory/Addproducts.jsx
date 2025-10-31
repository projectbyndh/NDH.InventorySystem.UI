// src/components/Inventory/AddProduct.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../Store/Productstore";
import useCategoryStore from "../Store/Categorystore";
import React from "react";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { createProduct, updateProduct, products } = useProductStore();
  const { categories } = useCategoryStore();

  const [form, setForm] = useState({
    name: "", description: "", sku: "", price: 0, cost: 0,
    quantityInStock: 0, minimumStockLevel: 0, reorderQuantity: 0,
    categoryId: "0", subCategoryId: "0", unitOfMeasureId: "0", primaryVendorId: "0",
    status: "Active", trackInventory: true, isSerialized: false, hasExpiry: false,
    variantGroupId: "", variants: [], attributes: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && products.length > 0) {
      const p = products.find(x => x.id === parseInt(id));
      if (p) setForm({ ...p, categoryId: p.categoryId?.toString() || "0" });
    }
  }, [id, isEdit, products]);

  const handleVariantChange = (idx, field, value) => {
    const newVariants = [...form.variants];
    newVariants[idx][field] = value;
    setForm({ ...form, variants: newVariants });
  };

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { id: 0, sku: "", price: 0, stockQuantity: 0, attributesJson: "" }] });
  };

  const removeVariant = (idx) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(parseInt(id), form);
      } else {
        await createProduct(form);
      }
      navigate("/inventory/product-crud");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit" : "Add"} Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input" />
          <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="input" />
          <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="input">
            <option value="0">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input" />
        </div>

        {/* Variants */}
        <div>
          <h3 className="font-semibold mb-2">Variants</h3>
          {form.variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input placeholder="Variant SKU" value={v.sku} onChange={e => handleVariantChange(i, 'sku', e.target.value)} className="input flex-1" />
              <input type="number" placeholder="Price" value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} className="input w-24" />
              <input type="number" placeholder="Stock" value={v.stockQuantity} onChange={e => handleVariantChange(i, 'stockQuantity', e.target.value)} className="input w-24" />
              <button type="button" onClick={() => removeVariant(i)} className="text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="text-blue-600 text-sm">+ Add Variant</button>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
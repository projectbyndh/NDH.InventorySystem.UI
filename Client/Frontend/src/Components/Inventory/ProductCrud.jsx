// src/components/Inventory/ProductCRUD.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import React from "react";
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
  DollarSign,
  Box,
  Barcode,
  Calendar,
  Clock,
  X,
  GripVertical,
} from "lucide-react";
import useProductStore from "../Store/Productstore";
import Spinner from "../Ui/Spinner";
import { handleError } from "../Ui/errorHandler";
import ActionButton from "../Ui/ActionButton";
import FormButton from "../Ui/FormButton";
import BackButton from "../Ui/BackButton";
import IconActionButton from "../Ui/IconActionButton";
import EmptyState from "../Ui/EmptyState";
import { Package } from "lucide-react";

export default function ProductCRUD() {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading: storeLoading,
  } = useProductStore();

  // List states
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Form states
  const [mode, setMode] = useState("list"); // "list" | "form"
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    cost: 0,
    quantityInStock: 0,
    minimumStockLevel: 0,
    imageUrl: null,
    trackInventory: true,
    isSerialized: false,
    hasExpiry: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    fetchProducts({ pageNumber: page, pageSize });
  }, [page, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // ──────────────────────────────────────────────
  // Form Handlers
  // ──────────────────────────────────────────────

  const startCreate = () => {
    setMode("form");
    setEditingProduct(null);
    setForm({
      name: "",
      sku: "",
      description: "",
      price: 0,
      cost: 0,
      quantityInStock: 0,
      minimumStockLevel: 0,
      imageUrl: null,
      trackInventory: true,
      isSerialized: false,
      hasExpiry: false,
    });
    setImagePreview(null);
    setFormErrors({});
    setSuccess(false);
  };

  const startEdit = (product) => {
    setMode("form");
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      description: product.description || "",
      price: product.price || 0,
      cost: product.cost || 0,
      quantityInStock: product.quantityInStock || 0,
      minimumStockLevel: product.minimumStockLevel || 0,
      imageUrl: product.imageUrl || null,
      trackInventory: product.trackInventory ?? true,
      isSerialized: product.isSerialized ?? false,
      hasExpiry: product.hasExpiry ?? false,
    });
    setImagePreview(product.imageUrl || null);
    setFormErrors({});
    setSuccess(false);
  };

  const cancelForm = () => {
    setMode("list");
    setEditingProduct(null);
    setForm({});
    setImagePreview(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (form.price < 0) errs.price = "Price cannot be negative";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors({ image: "Image must be less than 2MB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      handleFormChange("imageUrl", reader.result); // base64
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    handleFormChange("imageUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    setSuccess(false);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        cost: Number(form.cost || 0),
        quantityInStock: Number(form.quantityInStock || 0),
        minimumStockLevel: Number(form.minimumStockLevel || 0),
      };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setSuccess(true);
      await fetchProducts({ pageNumber: 1, pageSize });
      setTimeout(cancelForm, 1200);
    } catch (err) {
      handleError(err, { title: "Save failed" });
      setFormErrors({ submit: err?.response?.data?.message || "Failed to save product" });
    } finally {
      setFormLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────

  const openDeleteModal = (id, name) => setDeleteModal({ open: true, id, name });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null, name: "" });

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteProduct(deleteModal.id);
      await fetchProducts({ pageNumber: page, pageSize });
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <BackButton onClick={cancelForm} />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-slate-600 mt-1">
                {editingProduct ? "Update product details" : "Enter details for a new product"}
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
              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Product Image</label>
                <div className="flex items-start gap-6">
                  <div className="shrink-0 relative group">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-24 w-24 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="h-24 w-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    <p className="mt-2 text-xs text-slate-500">Max 2MB • JPG, PNG</p>
                    {formErrors.image && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {formErrors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name + SKU */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="e.g. Wireless Mouse"
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.name ? "border-red-500" : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-slate-500`}
                  />
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">SKU</label>
                  <input
                    value={form.sku}
                    onChange={(e) => handleFormChange("sku", e.target.value)}
                    placeholder="e.g. WM-001-BLK"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={3}
                  placeholder="Product details, features, etc..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                />
              </div>

              {/* Price, Cost, Stock */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={(e) => handleFormChange("price", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${formErrors.price ? "border-red-500" : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-slate-500`}
                    />
                  </div>
                  {formErrors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Cost Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.cost}
                      onChange={(e) => handleFormChange("cost", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Current Stock</label>
                  <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      min="0"
                      value={form.quantityInStock}
                      onChange={(e) => handleFormChange("quantityInStock", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-8 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.trackInventory}
                    onChange={(e) => handleFormChange("trackInventory", e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded border-slate-300 focus:ring-slate-500"
                  />
                  <span className="text-slate-700 font-medium">Track Inventory</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSerialized}
                    onChange={(e) => handleFormChange("isSerialized", e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded border-slate-300 focus:ring-slate-500"
                  />
                  <span className="text-slate-700 font-medium">Serialized Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasExpiry}
                    onChange={(e) => handleFormChange("hasExpiry", e.target.checked)}
                    className="w-5 h-5 text-slate-600 rounded border-slate-300 focus:ring-slate-500"
                  />
                  <span className="text-slate-700 font-medium">Track Expiry</span>
                </label>
              </div>

              {formErrors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {formErrors.submit}
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <FormButton
                  type="submit"
                  variant="primary"
                  loading={formLoading}
                  loadingText="Saving..."
                >
                  {editingProduct ? "Update Product" : "Create Product"}
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
  // LIST VIEW
  // ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-600 mt-1">Manage all inventory products</p>
          </div>
          <ActionButton onClick={startCreate}>
            Add Product
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
              placeholder="Search by name, SKU or description..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {storeLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-500">
              <Spinner className="w-12 h-12 mb-4" />
              <p>Loading products...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <EmptyState
              icon={<Package className="w-12 h-12 text-slate-300" />}
              title="No products found"
              subtitle="Get started by adding your first product to the inventory."
              action={
                <ActionButton onClick={startCreate} size="sm">
                  Create your first product
                </ActionButton>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700 w-24">Image</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">SKU</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-700">Price</th>
                    <th className="text-center px-6 py-4 font-semibold text-slate-700">Stock</th>
                    <th className="text-center px-6 py-4 font-semibold text-slate-700">Expiry</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((prod) => (
                    <tr key={prod.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="h-10 w-10 rounded-md object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{prod.name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                          {prod.sku || "—"}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          {Number(prod.price || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Box className="w-4 h-4 text-slate-500" />
                          <span className={prod.quantityInStock > 0 ? "text-green-700" : "text-red-600"}>
                            {prod.quantityInStock || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {prod.hasExpiry ? (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                            <Calendar className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <IconActionButton
                            icon={Edit2}
                            variant="edit"
                            ariaLabel="Edit"
                            onClick={() => startEdit(prod)}
                          />
                          <IconActionButton
                            icon={Trash2}
                            variant="delete"
                            ariaLabel="Delete"
                            onClick={() => openDeleteModal(prod.id, prod.name)}
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

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-red-50 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Product?</h3>
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
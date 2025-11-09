// src/Components/Inventory/ProductCRUD.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Package,
  Barcode,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  DollarSign,
  Box,
  Tag,
  Upload,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import useProductStore from "../Store/Productstore";
import useLoginStore from "../Store/Loginstore";

/* ── MODAL ───────────────────────────────────────────── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-slideUp">
        <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── DELETE CONFIRM MODAL ───────────────────────────── */
function DeleteConfirmModal({ open, onClose, onConfirm, name }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-slideUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Delete Product?</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── PRODUCT FORM (INSIDE CRUD) ─────────────────────── */
function ProductForm({ initial = {}, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    cost: 0,
    quantityInStock: 0,
    minimumStockLevel: 0,
    reorderQuantity: 0,
    categoryId: "",
    subCategoryId: "",
    unitOfMeasureId: "",
    primaryVendorId: "",
    status: "Active",
    trackInventory: true,
    isSerialized: false,
    hasExpiry: false,
    imageUrl: null,
    variants: [],
    attributes: [],
    ...initial,
  });

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(initial.imageUrl || null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, imageUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", sku: "", price: 0, stockQuantity: 0 }],
    }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const addAttribute = () => {
    setForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", value: "" }],
    }));
  };

  const updateAttribute = (index, field, value) => {
    const newAttrs = [...form.attributes];
    newAttrs[index][field] = value;
    setForm((prev) => ({ ...prev, attributes: newAttrs }));
  };

  const removeAttribute = (index) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaved(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-xl object-cover border-2 border-slate-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm h-11 px-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm h-11 px-3"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Price <span className="text-red-500">*</span></label>
          <input
            required
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm h-11 px-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Cost</label>
          <input
            type="number"
            step="0.01"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm h-11 px-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Stock</label>
          <input
            type="number"
            name="quantityInStock"
            value={form.quantityInStock}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm h-11 px-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Min Stock</label>
          <input
            type="number"
            name="minimumStockLevel"
            value={form.minimumStockLevel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm h-11 px-3"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6 py-3">
        {["trackInventory", "isSerialized", "hasExpiry"].map((field) => (
          <label key={field} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={field}
              checked={form[field]}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {field === "trackInventory" ? "Track Inventory" : field === "isSerialized" ? "Serialized" : "Has Expiry"}
            </span>
          </label>
        ))}
      </div>

      {/* Variants */}
      <div className="border-t pt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">Variants</h3>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Variant
          </button>
        </div>
        {form.variants.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No variants added.</p>
        ) : (
          <div className="space-y-3">
            {form.variants.map((v, i) => (
              <div key={i} className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg">
                <GripVertical className="h-5 w-5 text-slate-400 cursor-grab" />
                <input
                  placeholder="Name"
                  value={v.name || ""}
                  onChange={(e) => updateVariant(i, "name", e.target.value)}
                  className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded"
                />
                <input
                  placeholder="SKU"
                  value={v.sku || ""}
                  onChange={(e) => updateVariant(i, "sku", e.target.value)}
                  className="w-24 text-sm px-2 py-1 border border-slate-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price || 0}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="w-20 text-sm px-2 py-1 border border-slate-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stockQuantity || 0}
                  onChange={(e) => updateVariant(i, "stockQuantity", e.target.value)}
                  className="w-20 text-sm px-2 py-1 border border-slate-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attributes */}
      <div className="border-t pt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">Attributes</h3>
          <button
            type="button"
            onClick={addAttribute}
            className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Attribute
          </button>
        </div>
        {form.attributes.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No attributes added.</p>
        ) : (
          <div className="space-y-2">
            {form.attributes.map((a, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  placeholder="Name"
                  value={a.name || ""}
                  onChange={(e) => updateAttribute(i, "name", e.target.value)}
                  className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded"
                />
                <input
                  placeholder="Value"
                  value={a.value || ""}
                  onChange={(e) => updateAttribute(i, "value", e.target.value)}
                  className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeAttribute(i)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-sky-600 rounded-xl hover:bg-sky-700 flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {initial.id ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

/* ── MAIN PAGE ─────────────────────────────────────── */
export default function ProductCRUD() {
  const {
    products,
    total,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const { logout } = useLoginStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    fetchProducts({ pageNumber: page, pageSize });
  }, [page, fetchProducts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
          const url = row.original.imageUrl;
          return url ? (
            <img
              src={url}
              alt={row.original.name}
              className="h-10 w-10 rounded-md object-cover border border-slate-200"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100">
              <ImageIcon className="h-5 w-5 text-slate-400" />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-semibold text-slate-900">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
          <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
            {row.original.sku || "—"}
          </code>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 font-medium">
            <DollarSign className="h-4 w-4 text-green-600" />
            {Number(row.original.price).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "quantityInStock",
        header: "Stock",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Box className="h-4 w-4 text-slate-500" />
            <span
              className={row.original.quantityInStock > 0 ? "text-green-700" : "text-red-600"}
            >
              {row.original.quantityInStock}
            </span>
          </div>
        ),
      },
      {
        id: "trackInventory",
        header: "Track",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.trackInventory ? (
              <>
                <Tag className="h-4 w-4 text-emerald-600" />
                <span className="text-xs text-emerald-700">Yes</span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No</span>
            )}
          </div>
        ),
      },
      {
        id: "isSerialized",
        header: "Serial",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.isSerialized ? (
              <>
                <Barcode className="h-4 w-4 text-amber-600" />
                <span className="text-xs text-amber-700">Yes</span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No</span>
            )}
          </div>
        ),
      },
      {
        id: "hasExpiry",
        header: "Expiry",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.hasExpiry ? (
              <>
                <Calendar className="h-4 w-4 text-rose-600" />
                <span className="text-xs text-rose-700">Yes</span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No</span>
            )}
          </div>
        ),
      },
      {
        id: "created",
        header: "Created",
        cell: ({ row }) => {
          const d = row.original.createdAt ? new Date(row.original.createdAt) : null;
          return d ? (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {d.toLocaleDateString()}
            </div>
          ) : (
            "—"
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEdit(row.original)}
              className="p-1.5 rounded-md text-sky-600 hover:bg-sky-50 transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => openDelete(row.original.id, row.original.name)}
              className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [products]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    state: { pagination: { pageIndex: page - 1, pageSize } },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;
      setPage(newState.pageIndex + 1);
    },
  });

  const openEdit = (prod) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };
  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };
  const openDelete = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };
  const closeDelete = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  const handleSaved = async (formData) => {
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Product updated!", { icon: <CheckCircle className="h-5 w-5" /> });
      } else {
        await createProduct(formData);
        toast.success("Product created!", { icon: <CheckCircle className="h-5 w-5" /> });
      }
      closeModal();
      fetchProducts({ pageNumber: page, pageSize });
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        window.location.href = "/login";
      } else {
        toast.error(err?.response?.data?._message || "Save failed.", {
          icon: <XCircle className="h-5 w-5" />,
        });
      }
    }
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    closeDelete();
    const toastId = toast.loading("Deleting...");
    try {
      await deleteProduct(id);
      toast.success("Deleted!", { id: toastId, icon: <CheckCircle className="h-5 w-5" /> });
      if (filtered.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchProducts({ pageNumber: page, pageSize });
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        window.location.href = "/login";
      } else {
        toast.error("Delete failed.", { id: toastId, icon: <XCircle className="h-5 w-5" /> });
      }
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage all inventory products.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
          <button
            onClick={() => fetchProducts({ pageNumber: page, pageSize })}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, SKU, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* LOADING / ERROR */}
      {loading && (
        <div className="flex flex-col items-center py-16 text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-sky-600 mb-4"></div>
          <p>Loading products...</p>
        </div>
      )}
      {error && !loading && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* TABLE + PAGINATION */}
      {!loading && !error && (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((h) => (
                        <th
                          key={h.id}
                          className="px-5 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-5 py-4 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.getRowModel().rows.length === 0 && (
              <div className="py-20 text-center text-slate-500">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-lg font-medium">No products found.</p>
                <p className="mt-1 text-sm">Try adjusting your search.</p>
              </div>
            )}
          </div>

          {total > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-600">
              <div>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> of <strong>{total}</strong> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="px-3 py-2 font-medium text-slate-900">Page {page}</span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingProduct?.id ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
      >
        <ProductForm initial={editingProduct} onSaved={handleSaved} onCancel={closeModal} />
      </Modal>

      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        name={deleteModal.name}
      />
    </div>
  );
}
// src/components/Management/UnitOfMeasureManager.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUnitOfMeasureStore from "../Store/Unitofmeasurement"; // ← Keep if this is your actual path
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  XCircle,
  Trash2 as TrashIcon
} from "lucide-react";
import React from "react";
export default function UnitOfMeasureManager() {
  const navigate = useNavigate();
  const { units, fetchUnits, createUnit, updateUnit, deleteUnit } = useUnitOfMeasureStore();

  // === CRUD State ===
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", symbol: "", description: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");

  // === Delete Modal ===
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  // === Pagination ===
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const nameInputRef = useRef(null);

  // === Load Data ===
  useEffect(() => {
    fetchUnits({ pageNumber: page, pageSize });
  }, [page, fetchUnits]);

  // === Focus on form open ===
  useEffect(() => {
    if (mode === "form") {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [mode]);

  // === Filter Units ===
  const filteredUnits = units.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUnits.length / pageSize);
  const paginatedUnits = filteredUnits.slice((page - 1) * pageSize, page * pageSize);

  // === Validation ===
  const validate = () => {
    const e = {};
    const n = form.name.trim();
    const s = form.symbol.trim();

    if (!n) e.name = "Required";
    else if (n.length < 2) e.name = "Min 2 chars";
    else if (n.length > 50) e.name = "Max 50 chars";
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ -]+$/.test(n)) e.name = "Letters, spaces, hyphens only";

    if (!s) e.symbol = "Required";
    else if (s.length > 10) e.symbol = "Max 10 chars";

    if (form.description && form.description.length > 500) {
      e.description = "Max 500 chars";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // === CRUD Actions ===
  const startCreate = () => {
    setMode("form");
    setEditingId(null);
    setForm({ name: "", symbol: "", description: "" });
    setErrors({});
    setSuccess(false);
  };

  const startEdit = (unit) => {
    setMode("form");
    setEditingId(unit.id);
    setForm({
      name: unit.name,
      symbol: unit.symbol,
      description: unit.description || "",
    });
    setErrors({});
    setSuccess(false);
  };

  const cancelForm = () => {
    setMode("list");
    setEditingId(null);
    setForm({ name: "", symbol: "", description: "" });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const payload = {
        name: form.name.trim(),
        symbol: form.symbol.trim(),
        description: form.description.trim() || undefined,
      };

      if (editingId) {
        await updateUnit(editingId, payload);
      } else {
        await createUnit(payload);
      }

      setSuccess(true);
      await fetchUnits({ pageNumber: 1, pageSize });
      setTimeout(() => {
        setMode("list");
        setEditingId(null);
        setForm({ name: "", symbol: "", description: "" });
      }, 800);
    } catch (err) {
      setErrors({ submit: err?.response?.data?._message || "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setLoading(true);
    try {
      await deleteUnit(deleteModal.id);
      await fetchUnits({ pageNumber: page, pageSize });
      closeDeleteModal();
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // === Render Form ===
  if (mode === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={cancelForm}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
              aria-label="Back to list"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {editingId ? "Edit Unit" : "Add New Unit"}
              </h1>
              <p className="text-slate-600 mt-1">
                {editingId ? "Update details" : "Define a new unit of measurement"}
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
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="Kilogram"
                  className={`w-full px-4 py-3 rounded-xl border text-base transition-all
                    focus:outline-none focus:ring-2 focus:ring-slate-500
                    ${errors.name ? "border-red-500" : "border-slate-300"}`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500">2–50 letters, spaces, hyphens</p>
              </div>

              {/* Symbol */}
              <div>
                <label htmlFor="symbol" className="block text-sm font-semibold text-slate-800 mb-2">
                  Symbol <span className="text-red-500">*</span>
                </label>
                <input
                  id="symbol"
                  type="text"
                  value={form.symbol}
                  onChange={e => handleChange("symbol", e.target.value)}
                  required
                  maxLength={10}
                  placeholder="kg"
                  className={`w-full px-4 py-3 rounded-xl border text-base transition-all
                    focus:outline-none focus:ring-2 focus:ring-slate-500
                    ${errors.symbol ? "border-red-500" : "border-slate-300"}`}
                />
                {errors.symbol && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.symbol}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-2">
                  Description <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={e => handleChange("description", e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Standard unit of mass..."
                  className="w-full px-4 py-3 rounded-xl border resize-none transition-all
                    focus:outline-none focus:ring-2 focus:ring-slate-500 border-slate-300"
                />
                <p className="mt-2 text-xs text-right text-slate-500">
                  {form.description.length}/500
                </p>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errors.submit}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-semibold
                             hover:bg-black disabled:opacity-50 transition-all
                             flex items-center justify-center gap-2 shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingId ? "Update" : "Create"}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={loading}
                  className="flex-1 border border-slate-300 text-slate-700 py-3.5 rounded-xl font-semibold
                             hover:bg-slate-50 disabled:opacity-50 transition-all"
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

  // === LIST VIEW ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Unit of Measure</h1>
            <p className="text-slate-600 mt-1">Manage all measurement units</p>
          </div>
          <button
            onClick={startCreate}
            className="bg-slate-900 text-white px-5 py-3 rounded-xl font-medium
                       hover:bg-black transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Unit
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or symbol..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300
                         focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {paginatedUnits.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No units found.</p>
              <button
                onClick={startCreate}
                className="mt-4 text-slate-900 font-medium hover:underline"
              >
                Create your first unit
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Symbol</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-700">Description</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUnits.map(unit => (
                    <tr key={unit.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{unit.name}</td>
                      <td className="px-6 py-4 text-slate-600">{unit.symbol}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {unit.description || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(unit)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(unit.id, unit.name)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* === CUSTOM DELETE MODAL === */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Unit?</h3>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>? 
              This action <span className="text-red-600 font-medium">cannot be undone</span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium
                           hover:bg-red-700 disabled:opacity-50 transition-all
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={loading}
                className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl font-medium
                           hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
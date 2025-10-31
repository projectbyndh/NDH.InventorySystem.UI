// src/Components/Inventory/CategoryCRUD.jsx
import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";

import useCategoryStore from "../Store/Categorystore";
import CategoryForm from "./AddCategory";
import useLoginStore from "../Store/Loginstore";

/* ── MODAL ───────────────────────────────────────────── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-slideUp">
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
          <h3 className="text-lg font-semibold text-slate-900">Delete Category?</h3>
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

/* ── MAIN PAGE ─────────────────────────────────────── */
export default function CategoryCRUD() {
  const {
    categories,
    total,
    loading,
    error,
    fetchCategories,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const { logout } = useLoginStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // full object with id
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [page, setPage] = useState(1);
  const pageSize = 15;

  /* ── FETCH DATA BY PAGE ───────────────────────────── */
  useEffect(() => {
    fetchCategories({ pageNumber: page, pageSize });
  }, [page, fetchCategories]);

  /* ── CLIENT‑SIDE SEARCH ───────────────────────────── */
  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.code?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
    );
  }, [categories, search]);

  /* ── TABLE COLUMNS ────────────────────────────────── */
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
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
            {row.original.code || "—"}
          </code>
        ),
      },
      {
        accessorKey: "parentCategoryId",
        header: "Parent",
        cell: ({ row }) => {
          const parent = categories.find((c) => c.id === row.original.parentCategoryId);
          return <span className="text-sm text-slate-600">{parent?.name || "—"}</span>;
        },
      },
      {
        id: "variants",
        header: "Variants",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.hasVariants ? (
              <>
                <Package className="h-4 w-4 text-emerald-600" />
                <span className="text-xs text-emerald-700">Yes</span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No</span>
            )}
          </div>
        ),
      },
      {
        id: "serial",
        header: "Serial",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.requiresSerialNumbers ? (
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
        id: "expiry",
        header: "Expiry",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.trackExpiration ? (
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
    [categories]
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

  /* ── MODAL HELPERS ─────────────────────────────────── */
  const openEdit = (cat) => {
    setEditingCat(cat); // full object with id
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCat(null);
  };

  const openDelete = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };
  const closeDelete = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  /* ── UPDATE (EDIT) ────────────────────────────────── */
  const handleSaved = async (formData) => {
    if (!editingCat?.id) return;

    try {
      await updateCategory(editingCat.id, formData);
      toast.success("Category updated!", { icon: <CheckCircle className="h-5 w-5" /> });
      closeModal();
      fetchCategories({ pageNumber: page, pageSize });
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        window.location.href = "/login";
      } else {
        toast.error("Failed to update.", { icon: <XCircle className="h-5 w-5" /> });
      }
    }
  };

  /* ── DELETE ───────────────────────────────────────── */
  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    closeDelete();

    const toastId = toast.loading("Deleting...");

    try {
      await deleteCategory(id);
      toast.success("Deleted!", { id: toastId, icon: <CheckCircle className="h-5 w-5" /> });

      if (filtered.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchCategories({ pageNumber: page, pageSize });
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

  /* ── RENDER ─────────────────────────────────────────── */
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-600">
            View and manage existing product categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCategories({ pageNumber: page, pageSize })}
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
            placeholder="Search name, code, description..."
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
          <p>Loading categories...</p>
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
                <p className="text-lg font-medium">No categories found.</p>
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

      {/* EDIT MODAL */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={`Edit Category (ID: ${editingCat?.id || ""})`}
      >
        <CategoryForm
          initial={editingCat}
          onSaved={handleSaved}
          onCancel={closeModal}
        />
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        name={deleteModal.name}
      />
    </div>
  );
}
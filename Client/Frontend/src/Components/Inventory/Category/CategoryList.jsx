import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Search, Edit2, Trash2 } from "lucide-react";
import useCategoryStore from "../../Store/Categorystore";
import PageHeader from "../../Ui/PageHeader";
import Spinner from "../../Ui/Spinner";
import EmptyState from "../../Ui/EmptyState";

import IconActionButton from "../../Ui/IconActionButton";
import ConfirmModal from "../../Ui/ConfirmModal";
import TableWrapper from "../../Ui/TableWrapper";
import { handleError } from "../../Ui/errorHandler";

export default function CategoryList() {
    const navigate = useNavigate();
    const {
        categories,
        fetchCategories,
        deleteCategory,
        loading: storeLoading,
    } = useCategoryStore();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

    useEffect(() => {
        fetchCategories({ pageNumber: page, pageSize });
    }, [page, fetchCategories]);

    const filtered = useMemo(() => {
        if (!search.trim()) return categories;
        const term = search.toLowerCase();
        return categories.filter(c =>
            c.name?.toLowerCase().includes(term) ||
            c.code?.toLowerCase().includes(term)
        );
    }, [categories, search]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleDelete = async () => {
        try {
            await deleteCategory(deleteModal.id);
            setDeleteModal({ open: false, id: null, name: "" });
            await fetchCategories({ pageNumber: page, pageSize });
        } catch (err) {
            handleError(err, { title: "Delete failed" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <PageHeader
                title="Manage Categories"
                subtitle="Organize products into logical groups"
                btnText="Add Category"
                onBtnClick={() => navigate("/categories/new")}
                icon={Tag}
            />

            {/* Filters Area */}
            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name or code..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400 transition-all"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {storeLoading && paginated.length === 0 ? (
                    <div className="p-20 text-center">
                        <Spinner size={10} className="mx-auto mb-4" />
                        <p className="text-slate-500">Fetching categories...</p>
                    </div>
                ) : paginated.length === 0 ? (
                    <EmptyState
                        icon={<Tag className="w-12 h-12 text-slate-300" />}
                        title="No categories found"
                        subtitle={search ? "Adjust your search to find what you're looking for." : "Start by creating your first category."}
                        action={!search && (
                            <button onClick={() => navigate("/categories/new")} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium">
                                Create New Category
                            </button>
                        )}
                    />
                ) : (
                    <TableWrapper>
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 font-bold text-slate-700">Category Name</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-700">Code</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-700">Parent</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-700">Description</th>
                                    <th className="text-right px-6 py-4 font-bold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginated.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{cat.name}</td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-sm">{cat.code || "—"}</td>
                                        <td className="px-6 py-4 text-slate-600">{cat.parentCategoryName || "—"}</td>
                                        <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{cat.description || "—"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <IconActionButton
                                                    icon={Edit2}
                                                    variant="edit"
                                                    onClick={() => navigate(`/categories/edit/${cat.id}`)}
                                                />
                                                <IconActionButton
                                                    icon={Trash2}
                                                    variant="delete"
                                                    onClick={() => setDeleteModal({ open: true, id: cat.id, name: cat.name })}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableWrapper>
                )}
            </div>



            {/* Global Modals */}
            <ConfirmModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
                onConfirm={handleDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete ${deleteModal.name}? This category might be linked to products.`}
                confirmText="Delete Now"
                variant="danger"
            />
        </div>
    );
}

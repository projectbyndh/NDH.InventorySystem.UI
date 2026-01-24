import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, Edit2, Trash2, Box, DollarSign, AlertTriangle } from "lucide-react";
import useProductStore from "../../Store/Productstore";
import PageHeader from "../../Ui/PageHeader";
import Spinner from "../../Ui/Spinner";
import EmptyState from "../../Ui/EmptyState";

import IconActionButton from "../../Ui/IconActionButton";
import ConfirmModal from "../../Ui/ConfirmModal";
import TableWrapper from "../../Ui/TableWrapper";
import { handleError } from "../../Ui/errorHandler";

export default function ProductList() {
    const navigate = useNavigate();
    const {
        products,
        fetchProducts,
        deleteProduct,
        loading: storeLoading,
    } = useProductStore();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

    useEffect(() => {
        fetchProducts({ pageNumber: page, pageSize });
    }, [page, fetchProducts]);

    const filtered = useMemo(() => {
        if (!search.trim()) return products;
        const term = search.toLowerCase();
        return products.filter(p =>
            p.name?.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term)
        );
    }, [products, search]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleDelete = async () => {
        try {
            await deleteProduct(deleteModal.id);
            setDeleteModal({ open: false, id: null, name: "" });
            await fetchProducts({ pageNumber: page, pageSize });
        } catch (err) { handleError(err); }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 animate-fadeIn">
            <PageHeader
                title="Product Inventory"
                subtitle="Monitor and manage stock levels, pricing, and specs"
                btnText="Add Product"
                onBtnClick={() => navigate("/products/new")}
                icon={Package}
            />

            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name or SKU..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500/10 focus:border-slate-400 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {storeLoading && products.length === 0 ? (
                    <div className="p-20 text-center">
                        <Spinner size={10} className="mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Scanning inventory...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={<Package className="w-12 h-12 text-slate-300" />}
                        title="No products found"
                        subtitle={search ? "We couldn't find any products matching that SKU or name." : "Populate your inventory by adding your first product."}
                        action={!search && (
                            <button onClick={() => navigate("/products/new")} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-lg shadow-slate-900/20">
                                Create First Product
                            </button>
                        )}
                    />
                ) : (
                    <TableWrapper>
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Product Info</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Category</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Price / Cost</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Stock Status</th>
                                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginated.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{p.sku}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                                            {p.categoryName || <span className="text-slate-300">— Uncategorized</span>}
                                        </td>
                                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                                            <div>${p.price?.toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">Cost: ${p.cost?.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.quantityInStock <= p.minimumStockLevel ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                    {p.quantityInStock} in stock
                                                </span>
                                                {p.quantityInStock <= p.minimumStockLevel && <AlertTriangle className="w-4 h-4 text-amber-500" title="Low Stock Warning" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconActionButton
                                                    icon={Edit2}
                                                    variant="edit"
                                                    onClick={() => navigate(`/products/edit/${p.id}`)}
                                                />
                                                <IconActionButton
                                                    icon={Trash2}
                                                    variant="delete"
                                                    onClick={() => setDeleteModal({ open: true, id: p.id, name: p.name })}
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



            <ConfirmModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
                onConfirm={handleDelete}
                title="Discard Product Record?"
                message={`Are you sure you want to delete ${deleteModal.name}? This historical data might be required for sales reports.`}
                variant="danger"
            />
        </div>
    );
}

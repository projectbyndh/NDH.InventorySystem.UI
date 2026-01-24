import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Search, Edit2, Trash2, MapPin, Phone, Mail, User } from "lucide-react";
import { useWarehouse } from "../../Hooks/Warehousehooks";
import PageHeader from "../../Ui/PageHeader";
import Spinner from "../../Ui/Spinner";
import EmptyState from "../../Ui/EmptyState";

import IconActionButton from "../../Ui/IconActionButton";
import ConfirmModal from "../../Ui/ConfirmModal";
import TableWrapper from "../../Ui/TableWrapper";
import { handleError } from "../../Ui/errorHandler";

export default function WarehouseList() {
    const navigate = useNavigate();
    const {
        warehouses,
        loading: hookLoading,
        page,
        setPage,
        fetchWarehouses,
        deleteWarehouse,
    } = useWarehouse({ pageSize: 10 });

    const [search, setSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

    const filtered = useMemo(() => {
        if (!search.trim()) return warehouses;
        const term = search.toLowerCase();
        return warehouses.filter(w =>
            w.name?.toLowerCase().includes(term) ||
            w.contactPerson?.toLowerCase().includes(term) ||
            w.location?.addressLine1?.toLowerCase().includes(term)
        );
    }, [warehouses, search]);

    // useWarehouse hook handles pagination and fetching
    const totalPages = Math.ceil(filtered.length / 10); // Simple fallback check

    const handleDelete = async () => {
        try {
            await deleteWarehouse(deleteModal.id);
            setDeleteModal({ open: false, id: null, name: "" });
            // Hook will typically auto-refresh or you can trigger manual fetch
        } catch (err) {
            handleError(err, { title: "Delete failed" });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 animate-fadeIn">
            <PageHeader
                title="Warehouse Locations"
                subtitle="Manage your storage network and distribution hubs"
                btnText="Add Warehouse"
                onBtnClick={() => navigate("/warehouses/new")}
                icon={Building2}
            />

            {/* Quick Stats or Filters */}
            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or location..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-400 transition-all"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {hookLoading && warehouses.length === 0 ? (
                    <div className="p-20 text-center">
                        <Spinner size={10} className="mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Loading facilities...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={<Building2 className="w-12 h-12 text-slate-300" />}
                        title="No warehouses listed"
                        subtitle={search ? "We couldn't find any warehouses matching that search." : "Build your inventory network by adding your first warehouse hub."}
                        action={!search && (
                            <button onClick={() => navigate("/warehouses/new")} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-lg shadow-slate-900/20">
                                Register New Facility
                            </button>
                        )}
                    />
                ) : (
                    <TableWrapper>
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Facility Name</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Contact Person</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Communication</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Location</th>
                                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((w) => (
                                    <tr key={w.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                {w.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span>{w.contactPerson || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" />
                                                {w.contactNumber || "—"}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" />
                                                {w.email || "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            <div className="flex items-start gap-2 max-w-xs">
                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                                                <span>{w.location?.addressLine1}, {w.location?.districtName || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconActionButton
                                                    icon={Edit2}
                                                    variant="edit"
                                                    onClick={() => navigate(`/warehouses/edit/${w.id}`)}
                                                />
                                                <IconActionButton
                                                    icon={Trash2}
                                                    variant="delete"
                                                    onClick={() => setDeleteModal({ open: true, id: w.id, name: w.name })}
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
                title="Decommission Warehouse?"
                message={`Are you sure you want to delete ${deleteModal.name}? This might affect stock availability records.`}
                variant="danger"
            />
        </div>
    );
}

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Search, Edit2, Trash2, Phone, Mail, User } from "lucide-react";
import VendorService from "../../Api/VendorApi";
import PageHeader from "../../Ui/PageHeader";
import Spinner from "../../Ui/Spinner";
import EmptyState from "../../Ui/EmptyState";

import IconActionButton from "../../Ui/IconActionButton";
import ConfirmModal from "../../Ui/ConfirmModal";
import TableWrapper from "../../Ui/TableWrapper";
import { handleError } from "../../Ui/errorHandler";

export default function VendorList() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

    const fetchVendors = useCallback(async () => {
        setLoading(true);
        try {
            const data = await VendorService.getAll({ pageNumber: page, pageSize: 10 });
            setVendors(data.items || data || []);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const filtered = useMemo(() => {
        if (!search.trim()) return vendors;
        const term = search.toLowerCase();
        return vendors.filter(v =>
            v.name?.toLowerCase().includes(term) ||
            v.contactPerson?.toLowerCase().includes(term) ||
            v.email?.toLowerCase().includes(term)
        );
    }, [vendors, search]);

    const handleDelete = async () => {
        try {
            await VendorService.delete(deleteModal.id);
            setDeleteModal({ open: false, id: null, name: "" });
            fetchVendors();
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 animate-fadeIn">
            <PageHeader
                title="Vendor Directory"
                subtitle="Manage supply partners and procurement contacts"
                btnText="Add Vendor"
                onBtnClick={() => navigate("/vendors/new")}
                icon={Building2}
            />

            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search vendors..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500/10 focus:border-slate-400 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading && vendors.length === 0 ? (
                    <div className="p-20 text-center">
                        <Spinner size={10} className="mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Loading vendor list...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={<Building2 className="w-12 h-12 text-slate-300" />}
                        title="No vendors registered"
                        subtitle={search ? "No matches found for your search." : "Build your supply chain by adding your first vendor partner."}
                        action={!search && (
                            <button onClick={() => navigate("/vendors/new")} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-lg shadow-slate-900/20">
                                Onboard New Vendor
                            </button>
                        )}
                    />
                ) : (
                    <TableWrapper>
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Company Name</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Contact Person</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Communication</th>
                                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((v) => (
                                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 font-bold text-slate-900">{v.name}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span>{v.contactPerson || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Phone className="w-3.5 h-3.5" />
                                                {v.contactNumber || "—"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Mail className="w-3.5 h-3.5" />
                                                {v.email || "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconActionButton
                                                    icon={Edit2}
                                                    variant="edit"
                                                    onClick={() => navigate(`/vendors/edit/${v.id}`)}
                                                />
                                                <IconActionButton
                                                    icon={Trash2}
                                                    variant="delete"
                                                    onClick={() => setDeleteModal({ open: true, id: v.id, name: v.name })}
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
                title="Remove Vendor?"
                message={`Are you sure you want to delete ${deleteModal.name}? This action might affect open purchase orders.`}
                variant="danger"
            />
        </div>
    );
}

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Search, Edit2, Trash2 } from "lucide-react";
import useUnitOfMeasureStore from "../../Store/Unitofmeasurement";
import PageHeader from "../../Ui/PageHeader";
import Spinner from "../../Ui/Spinner";
import EmptyState from "../../Ui/EmptyState";

import IconActionButton from "../../Ui/IconActionButton";
import ConfirmModal from "../../Ui/ConfirmModal";
import TableWrapper from "../../Ui/TableWrapper";
import { handleError } from "../../Ui/errorHandler";

export default function UnitList() {
    const navigate = useNavigate();
    const { units, fetchUnits, deleteUnit, loading: storeLoading } = useUnitOfMeasureStore();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

    useEffect(() => {
        fetchUnits({ pageNumber: page, pageSize: 10 });
    }, [page, fetchUnits]);

    const filtered = useMemo(() => {
        if (!search.trim()) return units;
        const term = search.toLowerCase();
        return units.filter(u =>
            u.name?.toLowerCase().includes(term) ||
            u.symbol?.toLowerCase().includes(term)
        );
    }, [units, search]);

    const handleDelete = async () => {
        try {
            await deleteUnit(deleteModal.id);
            setDeleteModal({ open: false, id: null, name: "" });
            fetchUnits({ pageNumber: page, pageSize: 10 });
        } catch (err) { handleError(err); }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
            <PageHeader
                title="Units of Measure"
                subtitle="Define and manage global measurement standards"
                btnText="Add Unit"
                onBtnClick={() => navigate("/units/new")}
                icon={Scale}
            />

            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search units..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-slate-500/10 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {storeLoading && units.length === 0 ? (
                    <div className="p-20 text-center">
                        <Spinner size={10} className="mx-auto mb-4" />
                        <p className="text-slate-500">Loading measurement units...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={<Scale className="w-12 h-12 text-slate-300" />}
                        title="No units defined"
                        subtitle={search ? "No results found." : "Register the measurement units used in your inventory system."}
                        action={!search && (
                            <button onClick={() => navigate("/units/new")} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg">
                                Define First Unit
                            </button>
                        )}
                    />
                ) : (
                    <TableWrapper>
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Unit Name</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Symbol</th>
                                    <th className="text-left px-6 py-5 font-bold text-slate-700">Description</th>
                                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5 font-bold text-slate-900">{u.name}</td>
                                        <td className="px-6 py-5 text-slate-600">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">{u.symbol}</span>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600 truncate max-w-xs">{u.description || "—"}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconActionButton icon={Edit2} variant="edit" onClick={() => navigate(`/units/edit/${u.id}`)} />
                                                <IconActionButton icon={Trash2} variant="delete" onClick={() => setDeleteModal({ open: true, id: u.id, name: u.name })} />
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
                title="Delete Unit?"
                message={`Permanently remove ${deleteModal.name} from the system? Items using this unit might be affected.`}
                variant="danger"
            />
        </div>
    );
}

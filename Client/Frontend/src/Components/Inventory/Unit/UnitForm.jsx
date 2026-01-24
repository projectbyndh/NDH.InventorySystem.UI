import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Scale, AlertCircle, CheckCircle } from "lucide-react";
import useUnitOfMeasureStore from "../../Store/Unitofmeasurement";
import FormButton from "../../Ui/FormButton";
import PageHeader from "../../Ui/PageHeader";
import SectionCard from "../../Ui/SectionCard";
import { handleError } from "../../Ui/errorHandler";

export default function UnitForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { units, fetchUnits, createUnit, updateUnit } = useUnitOfMeasureStore();

    const [form, setForm] = useState({ name: "", symbol: "", description: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const u = units.find(unit => String(unit.id) === String(id));
            if (u) {
                setForm({ name: u.name, symbol: u.symbol, description: u.description || "" });
            }
        }
    }, [id, isEdit, units]);

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Unit name is required";
        if (!form.symbol.trim()) e.symbol = "Symbol is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (isEdit) await updateUnit(id, form);
            else await createUnit(form);
            setSuccess(true);
            setTimeout(() => navigate("/units"), 1000);
        } catch (err) {
            handleError(err);
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <PageHeader
                title={isEdit ? "Edit Unit" : "Define Unit"}
                subtitle={isEdit ? "Update measurement standards" : "Register a new unit of measurement"}
                showBack
                onBack={() => navigate("/units")}
                icon={Scale}
            />

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-slideUp">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Unit of measure saved successfully.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <SectionCard title="Measurement Specifications">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Unit Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                placeholder="e.g. Kilogram"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Unit Symbol <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.symbol}
                                onChange={(e) => handleFormChange("symbol", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.symbol ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                placeholder="e.g. kg"
                            />
                            {errors.symbol && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.symbol}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none resize-none"
                                rows={3}
                                placeholder="Contextual details for this measurement..."
                            />
                        </div>
                    </div>
                </SectionCard>

                <div className="flex gap-4 pt-4">
                    <FormButton type="submit" variant="primary" loading={loading} loadingText="Saving Unit...">
                        {isEdit ? "Update Unit" : "Save Unit"}
                    </FormButton>
                    <FormButton type="button" variant="secondary" onClick={() => navigate("/units")} disabled={loading}>
                        Cancel
                    </FormButton>
                </div>
            </form>
        </div>
    );
}

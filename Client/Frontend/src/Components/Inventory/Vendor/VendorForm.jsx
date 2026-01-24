import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, AlertCircle, CheckCircle, User, Phone, Mail, MapPin } from "lucide-react";
import VendorService from "../../Api/VendorApi";
import DropdownService from "../../Api/Dropdown";
import FormButton from "../../Ui/FormButton";
import PageHeader from "../../Ui/PageHeader";
import SectionCard from "../../Ui/SectionCard";
import { handleError } from "../../Ui/errorHandler";

export default function VendorForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        name: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        location: {
            country: "Nepal",
            stateProvinceId: "",
            districtId: "",
            municipalityId: "",
            wardNo: "",
            addressLine1: "",
            postalCode: "",
        }
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Dropdowns
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                const s = await DropdownService.getStateProvinces();
                setStates(s.data || s || []);

                if (isEdit) {
                    const v = await VendorService.getById(id);
                    if (v) {
                        setForm({
                            name: v.name || "",
                            contactPerson: v.contactPerson || "",
                            contactNumber: v.contactNumber || "",
                            email: v.email || "",
                            location: {
                                country: v.location?.country || "Nepal",
                                stateProvinceId: v.location?.stateProvinceId || "",
                                districtId: v.location?.districtId || "",
                                municipalityId: v.location?.municipalityId || "",
                                wardNo: v.location?.wardNo || "",
                                addressLine1: v.location?.addressLine1 || "",
                                postalCode: v.location?.postalCode || "",
                            }
                        });
                        if (v.location?.stateProvinceId) fetchDistricts(v.location.stateProvinceId);
                        if (v.location?.districtId) fetchMunicipalities(v.location.districtId);
                    }
                }
            } catch (err) {
                handleError(err);
            }
        };
        init();
    }, [id, isEdit]);

    const fetchDistricts = async (sid) => {
        const d = await DropdownService.getDistricts(sid);
        setDistricts(d.data || d || []);
    };

    const fetchMunicipalities = async (did) => {
        const m = await DropdownService.getMunicipalities(did);
        setMunicipalities(m.data || m || []);
    };

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleLocationChange = (field, value) => {
        setForm(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));
        if (field === "stateProvinceId") { setDistricts([]); setMunicipalities([]); if (value) fetchDistricts(value); }
        if (field === "districtId") { setMunicipalities([]); if (value) fetchMunicipalities(value); }
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Vendor name is required";
        if (!form.contactNumber.trim()) e.phone = "Contact number is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                ...form,
                location: {
                    ...form.location,
                    stateProvinceId: form.location.stateProvinceId ? Number(form.location.stateProvinceId) : null,
                    districtId: form.location.districtId ? Number(form.location.districtId) : null,
                    municipalityId: form.location.municipalityId ? Number(form.location.municipalityId) : null,
                    wardNo: Number(form.location.wardNo) || 0,
                }
            };
            if (isEdit) await VendorService.update(id, payload);
            else await VendorService.create(payload);
            setSuccess(true);
            setTimeout(() => navigate("/vendors"), 1200);
        } catch (err) {
            handleError(err);
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <PageHeader
                title={isEdit ? "Edit Vendor" : "Onboard New Vendor"}
                subtitle={isEdit ? "Modify partnership details" : "Register a new supply partner in the system"}
                showBack
                onBack={() => navigate("/vendors")}
                icon={Building2}
            />

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-slideUp">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Vendor profile updated successfully.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <SectionCard title="Vendor Profile">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Company Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                                placeholder="e.g. Acme Supplies Pvt. Ltd."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Primary Contact Person</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.contactPerson}
                                    onChange={(e) => handleFormChange("contactPerson", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Contact Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.contactNumber}
                                    onChange={(e) => handleFormChange("contactNumber", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                    placeholder="+977-XXXXXXXXXX"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleFormChange("email", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                    placeholder="partner@company.com"
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Vendor Address">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">State</label>
                            <select
                                value={form.location.stateProvinceId}
                                onChange={(e) => handleLocationChange("stateProvinceId", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s.id} value={s.id}>{s.name || s.provinceName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">District</label>
                            <select
                                value={form.location.districtId}
                                onChange={(e) => handleLocationChange("districtId", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white disabled:bg-slate-50"
                                disabled={!form.location.stateProvinceId}
                            >
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name || d.districtName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Municipality</label>
                            <select
                                value={form.location.municipalityId}
                                onChange={(e) => handleLocationChange("municipalityId", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white disabled:bg-slate-50"
                                disabled={!form.location.districtId}
                            >
                                <option value="">Select Municipality</option>
                                {municipalities.map(m => <option key={m.id} value={m.id}>{m.name || m.municipalityName}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Full Address</label>
                            <input
                                type="text"
                                value={form.location.addressLine1}
                                onChange={(e) => handleLocationChange("addressLine1", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                placeholder="Street, Neighborhood, Landmark"
                            />
                        </div>
                    </div>
                </SectionCard>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <FormButton type="submit" variant="primary" loading={loading} loadingText="Saving Vendor...">
                        {isEdit ? "Update Vendor" : "Save Vendor"}
                    </FormButton>
                    <FormButton type="button" variant="secondary" onClick={() => navigate("/vendors")} disabled={loading}>
                        Cancel
                    </FormButton>
                </div>
            </form>
        </div>
    );
}

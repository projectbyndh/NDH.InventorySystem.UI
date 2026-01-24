import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, AlertCircle, CheckCircle, Home, Phone, Globe, MapPin, User } from "lucide-react";
import { useWarehouse } from "../../Hooks/Warehousehooks";
import DropdownService from "../../Api/Dropdown";
import FormButton from "../../Ui/FormButton";
import PageHeader from "../../Ui/PageHeader";
import SectionCard from "../../Ui/SectionCard";
import { handleError } from "../../Ui/errorHandler";

export default function WarehouseForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const {
        warehouses,
        createWarehouse,
        updateWarehouse,
    } = useWarehouse({ pageSize: 100 }); // Large page size to ensure we have the list for editing

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

    // Initial Load
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await DropdownService.getStateProvinces();
                setStates(res.data || res || []);
            } catch (err) {
                console.error("Failed to fetch states", err);
            }
        };
        fetchStates();

        if (isEdit && warehouses.length > 0) {
            const w = warehouses.find(wh => String(wh.id) === String(id));
            if (w) {
                setForm({
                    name: w.name || "",
                    contactPerson: w.contactPerson || "",
                    contactNumber: w.contactNumber || "",
                    email: w.email || "",
                    location: {
                        country: w.location?.country || "Nepal",
                        stateProvinceId: w.location?.stateProvinceId || "",
                        districtId: w.location?.districtId || "",
                        municipalityId: w.location?.municipalityId || "",
                        wardNo: w.location?.wardNo || "",
                        addressLine1: w.location?.addressLine1 || "",
                        postalCode: w.location?.postalCode || "",
                    }
                });
                // Trigger cascading fetches
                if (w.location?.stateProvinceId) fetchDistricts(w.location.stateProvinceId);
                if (w.location?.districtId) fetchMunicipalities(w.location.districtId);
            }
        }
    }, [id, isEdit, warehouses]);

    const fetchDistricts = async (stateId) => {
        try {
            const res = await DropdownService.getDistricts(stateId);
            setDistricts(res.data || res || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMunicipalities = async (districtId) => {
        try {
            const res = await DropdownService.getMunicipalities(districtId);
            setMunicipalities(res.data || res || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleLocationChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            location: { ...prev.location, [field]: value }
        }));

        if (field === "stateProvinceId") {
            setDistricts([]);
            setMunicipalities([]);
            if (value) fetchDistricts(value);
        }
        if (field === "districtId") {
            setMunicipalities([]);
            if (value) fetchMunicipalities(value);
        }
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Warehouse name is required";
        if (!form.contactPerson.trim()) e.contactPerson = "Contact person is required";
        if (!form.location.addressLine1.trim()) e.address = "Address is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setSuccess(false);

        try {
            const payload = {
                ...form,
                location: {
                    ...form.location,
                    stateProvinceId: form.location.stateProvinceId ? Number(form.location.stateProvinceId) : null,
                    districtId: form.location.districtId ? Number(form.location.districtId) : null,
                    municipalityId: form.location.municipalityId ? Number(form.location.municipalityId) : null,
                    wardNo: form.location.wardNo ? Number(form.location.wardNo) : 0,
                }
            };

            if (isEdit) {
                await updateWarehouse(id, payload);
            } else {
                await createWarehouse(payload);
            }

            setSuccess(true);
            setTimeout(() => navigate("/warehouses"), 1200);
        } catch (err) {
            handleError(err, { title: "Save failed" });
            setErrors({ submit: err?.response?.data?.message || "Failed to save warehouse" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
            <PageHeader
                title={isEdit ? "Edit Warehouse" : "Register Warehouse"}
                subtitle={isEdit ? "Update facility details" : "Add a new distribution or storage center"}
                showBack
                onBack={() => navigate("/warehouses")}
                icon={Building2}
            />

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-slideUp">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Warehouse saved successfully!</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <SectionCard title="Facility Details">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Warehouse Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                placeholder="e.g. Kathmandu Central Hub"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Primary Contact Person <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.contactPerson}
                                    onChange={(e) => handleFormChange("contactPerson", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.contactPerson ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                    placeholder="Full Name"
                                />
                            </div>
                            {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Legal Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.contactNumber}
                                    onChange={(e) => handleFormChange("contactNumber", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                    placeholder="+977-98XXXXXXXX"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Official Email</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleFormChange("email", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                    placeholder="warehouse@company.com"
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Location Settings">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">State / Province</label>
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
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Street Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.location.addressLine1}
                                    onChange={(e) => handleLocationChange("addressLine1", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.address ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                    placeholder="e.g. Main Street, Building 4B"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Ward No.</label>
                            <input
                                type="number"
                                value={form.location.wardNo}
                                onChange={(e) => handleLocationChange("wardNo", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                placeholder="e.g. 5"
                            />
                        </div>
                    </div>
                </SectionCard>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <FormButton
                        type="submit"
                        variant="primary"
                        loading={loading}
                        loadingText="Processing..."
                    >
                        {isEdit ? "Update Warehouse" : "Register Warehouse"}
                    </FormButton>

                    <FormButton
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/warehouses")}
                        disabled={loading}
                    >
                        Cancel
                    </FormButton>
                </div>
            </form>
        </div>
    );
}

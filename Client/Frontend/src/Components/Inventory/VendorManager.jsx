// src/components/Management/VendorManager.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useVendorStore from "../Store/Vendorstore";
import useLoginStore from "../Store/Loginstore";
import {
  Plus, Edit2, Trash2, Loader2, Search, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Building2, Phone, Mail, MapPin, Home, Globe, Hash
} from "lucide-react";
import React from "react";

export default function VendorManager() {
  const navigate = useNavigate();
  const { token } = useLoginStore();
  const { vendors, fetchVendors, createVendor, updateVendor, deleteVendor } = useVendorStore();

  // === Auth Guard ===
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // === CRUD State ===
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");

  // === Delete Modal ===
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  // === Pagination ===
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // === Form State ===
  const initialForm = {
    name: "", contactPerson: "", contactNumber: "", email: "",
    location: {
      country: "", stateProvince: "", district: "", municipality: "", municipalityType: "",
      wardNo: "", addressLine1: "", addressLine2: "", postalCode: "", latitude: "", longitude: ""
    }
  };
  const [form, setForm] = useState(initialForm);
  const nameInputRef = useRef(null);

  // === Load Data ===
  useEffect(() => {
    if (token) fetchVendors({ pageNumber: page, pageSize });
  }, [page, token, fetchVendors]);

  // === Focus ===
  useEffect(() => {
    if (mode === "form") {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [mode]);

  // === Filter ===
  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / pageSize);
  const paginatedVendors = filteredVendors.slice((page - 1) * pageSize, page * pageSize);

  // === Validation ===
  const validate = () => {
    const e = {};
    const loc = form.location;

    if (!form.name.trim()) e.name = "Company name required";
    else if (form.name.length > 100) e.name = "Max 100 characters";

    if (!form.contactPerson.trim()) e.contactPerson = "Contact person required";

    if (!form.contactNumber.trim()) e.contactNumber = "Phone required";
    else if (!/^\+?\d{7,15}$/.test(form.contactNumber)) e.contactNumber = "Invalid phone (7–15 digits)";

    if (!form.email.trim()) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";

    if (!loc.country.trim()) e["location.country"] = "Country required";
    if (!loc.addressLine1.trim()) e["location.addressLine1"] = "Address Line 1 required";
    if (!loc.postalCode.trim()) e["location.postalCode"] = "Postal Code required";
    else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(loc.postalCode)) e["location.postalCode"] = "Invalid postal code";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleLocationChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
    const key = `location.${field}`;
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  // === CRUD Actions ===
  const startCreate = () => {
    setMode("form");
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    setSuccess(false);
  };

  const startEdit = (vendor) => {
    setMode("form");
    setEditingId(vendor.id);
    setForm({
      name: vendor.name || "",
      contactPerson: vendor.contactPerson || "",
      contactNumber: vendor.contactNumber || "",
      email: vendor.email || "",
      location: {
        country: vendor.location?.country || "",
        stateProvince: vendor.location?.stateProvince || "",
        district: vendor.location?.district || "",
        municipality: vendor.location?.municipality || "",
        municipalityType: vendor.location?.municipalityType || "",
        wardNo: vendor.location?.wardNo?.toString() || "",
        addressLine1: vendor.location?.addressLine1 || "",
        addressLine2: vendor.location?.addressLine2 || "",
        postalCode: vendor.location?.postalCode || "",
        latitude: vendor.location?.latitude || "",
        longitude: vendor.location?.longitude || ""
      }
    });
    setErrors({});
    setSuccess(false);
  };

  const cancelForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(initialForm);
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
        contactPerson: form.contactPerson.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        location: {
          country: form.location.country.trim(),
          stateProvince: form.location.stateProvince.trim() || undefined,
          district: form.location.district.trim() || undefined,
          municipality: form.location.municipality.trim() || undefined,
          municipalityType: form.location.municipalityType.trim() || undefined,
          wardNo: form.location.wardNo ? parseInt(form.location.wardNo) : undefined,
          addressLine1: form.location.addressLine1.trim(),
          addressLine2: form.location.addressLine2.trim() || undefined,
          postalCode: form.location.postalCode.trim(),
          latitude: form.location.latitude.trim() || undefined,
          longitude: form.location.longitude.trim() || undefined,
        }
      };

      if (editingId) {
        await updateVendor(editingId, payload);
      } else {
        await createVendor(payload);
      }

      setSuccess(true);
      await fetchVendors({ pageNumber: 1, pageSize });
      setTimeout(() => {
        setMode("list");
        setEditingId(null);
        setForm(initialForm);
      }, 800);
    } catch (err) {
      setErrors({ submit: err?.response?.data?._message || "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => setDeleteModal({ open: true, id, name });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null, name: "" });

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setLoading(true);
    try {
      await deleteVendor(deleteModal.id);
      await fetchVendors({ pageNumber: page, pageSize });
      closeDeleteModal();
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // === FORM VIEW ===
  if (mode === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={cancelForm}
              className="p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {editingId ? "Edit Vendor" : "Add New Vendor"}
              </h1>
              <p className="text-slate-600 mt-1">
                {editingId ? "Update vendor information" : "Register a new supplier"}
              </p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Vendor saved successfully!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* === BASIC INFO === */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-slate-700" />
                  Company Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        placeholder="Acme Corporation"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base transition-all
                          focus:outline-none focus:ring-2 focus:ring-slate-500
                          ${errors.name ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.contactPerson}
                      onChange={e => handleChange("contactPerson", e.target.value)}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl border text-base transition-all
                        focus:outline-none focus:ring-2 focus:ring-slate-500
                        ${errors.contactPerson ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.contactPerson && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.contactPerson}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={form.contactNumber}
                        onChange={e => handleChange("contactNumber", e.target.value)}
                        placeholder="+977 9800000000"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base transition-all
                          focus:outline-none focus:ring-2 focus:ring-slate-500
                          ${errors.contactNumber ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors.contactNumber && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.contactNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder="vendor@acme.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base transition-all
                          focus:outline-none focus:ring-2 focus:ring-slate-500
                          ${errors.email ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                  </div>
                </div>
              </section>

              {/* === LOCATION === */}
              <section className="border-t pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-slate-700" />
                  Location Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={form.location.country}
                        onChange={e => handleLocationChange("country", e.target.value)}
                        placeholder="Nepal"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border
                          ${errors["location.country"] ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors["location.country"] && <p className="mt-1 text-sm text-red-600">{errors["location.country"]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={form.location.stateProvince}
                      onChange={e => handleLocationChange("stateProvince", e.target.value)}
                      placeholder="Bagmati"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
                    <input
                      type="text"
                      value={form.location.district}
                      onChange={e => handleLocationChange("district", e.target.value)}
                      placeholder="Kathmandu"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Municipality</label>
                    <input
                      type="text"
                      value={form.location.municipality}
                      onChange={e => handleLocationChange("municipality", e.target.value)}
                      placeholder="Kathmandu Metropolitan"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Ward No</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={form.location.wardNo}
                        onChange={e => handleLocationChange("wardNo", e.target.value)}
                        placeholder="10"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={form.location.postalCode}
                        onChange={e => handleLocationChange("postalCode", e.target.value)}
                        placeholder="44600"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border
                          ${errors["location.postalCode"] ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors["location.postalCode"] && <p className="mt-1 text-sm text-red-600">{errors["location.postalCode"]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.location.addressLine1}
                      onChange={e => handleLocationChange("addressLine1", e.target.value)}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 rounded-xl border
                        ${errors["location.addressLine1"] ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors["location.addressLine1"] && <p className="mt-1 text-sm text-red-600">{errors["location.addressLine1"]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={form.location.addressLine2}
                      onChange={e => handleLocationChange("addressLine2", e.target.value)}
                      placeholder="Suite 100"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </section>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {errors.submit}
                </div>
              )}

              <div className="flex gap-4 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg
                             hover:bg-black disabled:opacity-50 transition-all
                             flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingId ? "Update Vendor" : "Create Vendor"}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={loading}
                  className="flex-1 border-2 border-slate-300 text-slate-700 py-3.5 rounded-xl font-bold text-lg
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendor Management</h1>
            <p className="text-slate-600 mt-1">Manage all your suppliers in one place</p>
          </div>
          <button
            onClick={startCreate}
            className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold
                       hover:bg-black transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-6 h-6" />
            Add Vendor
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, contact, email..."
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-slate-300 text-base
                         focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {paginatedVendors.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-slate-100 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">No vendors found.</p>
              <button onClick={startCreate} className="mt-4 text-slate-900 font-semibold hover:underline">
                Add your first vendor
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Company</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Contact</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Email</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Location</th>
                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVendors.map(v => (
                    <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-slate-900">{v.name}</td>
                      <td className="px-6 py-5 text-slate-600">{v.contactPerson}</td>
                      <td className="px-6 py-5 text-slate-600">{v.email}</td>
                      <td className="px-6 py-5 text-slate-600">
                        <div className="max-w-xs">
                          <p className="truncate">{v.location?.addressLine1}</p>
                          <p className="text-xs text-slate-500">{v.location?.postalCode && `${v.location.postalCode}, `}{v.location?.country}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(v)}
                            className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(v.id, v.name)}
                            className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
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
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-xl bg-white shadow hover:shadow-md disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-700 font-medium">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-xl bg-white shadow hover:shadow-md disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Delete Vendor?</h3>
            </div>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Are you sure you want to <strong>permanently delete</strong> vendor:
              <br />
              <span className="text-slate-900 font-semibold">{deleteModal.name}</span>?
              <br />
              <span className="text-red-600 text-sm">This action cannot be undone.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-lg
                           hover:bg-red-700 disabled:opacity-50 transition-all
                           flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete Vendor"}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={loading}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-bold text-lg
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
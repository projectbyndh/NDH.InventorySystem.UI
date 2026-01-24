// src/Components/Inventory/VendorManager.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLoginStore from "../Store/Loginstore";
import VendorService from "../Api/VendorApi";
import DropdownService from "../Api/Dropdown";
import React from "react";
import { handleError } from "../Ui/errorHandler";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Home,
  Globe,
  Hash,
} from "lucide-react";
import SearchInput from "../Ui/SearchInput";
import Spinner from "../Ui/Spinner";
import ConfirmModal from "../Ui/ConfirmModal";
import TableWrapper from "../Ui/TableWrapper";
import EmptyState from "../Ui/EmptyState";
import Pagination from "../Ui/Pagination";
import ActionButton from "../Ui/ActionButton";
import FormButton from "../Ui/FormButton";
import BackButton from "../Ui/BackButton";
import IconActionButton from "../Ui/IconActionButton";

export default function VendorManager() {
  const navigate = useNavigate();
  const { token } = useLoginStore();

  // === STATE ===
  const [vendors, setVendors] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  // === FORM ===
  const initialForm = {
    name: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    location: {
      country: "",
      stateProvince: "",
      district: "",
      municipality: "",
      municipalityType: "",
      wardNo: 0,
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
  };
  const [form, setForm] = useState(initialForm);
  const nameInputRef = useRef(null);

  // === DROPDOWNS ===
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [stateProvinces, setStateProvinces] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(null);

  // === AUTH GUARD ===
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // === FETCH VENDORS ===
  const fetchVendors = useCallback(async ({ pageNumber, pageSize }) => {
    setFetchLoading(true);
    try {
      const data = await VendorService.getAll({ pageNumber, pageSize });
      // Backend may return array or an object with items; normalize to array
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.items && Array.isArray(data.items)) list = data.items;
      else if (data?.data && Array.isArray(data.data)) list = data.data;
      else list = [];
      // normalize id property so downstream code can rely on `id`
      const normalized = list.map((it) => ({
        ...it,
        id: getId(it),
      }));
      setVendors(normalized);
    } catch (err) {
      handleError(err, { title: "Failed to fetch vendors" });
      setVendors([]);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) fetchVendors({ pageNumber: 1, pageSize });
  }, [token]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token && mode === "list") {
      fetchVendors({ pageNumber: page, pageSize });
    }
  }, [page, token, mode]);

  // === LOAD DROPDOWNS ===
  const unwrap = (res) => {
    const body = res?.data ?? res;
    return body?._data ?? body?.data ?? body ?? [];
  };

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setDropdownLoading(true);
      setDropdownError(null);
      try {
        const [dRes, mRes, sRes] = await Promise.all([
          DropdownService.getDistricts(),
          DropdownService.getMunicipalities(),
          DropdownService.getStateProvinces(),
        ]);
        setDistricts(unwrap(dRes));
        setMunicipalities(unwrap(mRes));
        setStateProvinces(unwrap(sRes));
      } catch (err) {
        handleError(err, { title: "Failed to load dropdowns" });
        setDropdownError(err?.message ?? "Failed to load dropdowns");
      } finally {
        setDropdownLoading(false);
      }
    };
    load();
  }, [token]);

  // === HELPERS ===
  const mapLabel = (opt) => {
    if (!opt) return "";
    return [
      opt.name,
      opt.provinceName,
      opt.districtName,
      opt.municipalityName,
      opt.stateName,
      opt.label,
      opt.text,
      opt.title,
      opt.en,
      opt.ne,
      opt.np,
    ].find((c) => c != null) ?? "Unnamed";
  };

  const mapValue = (opt) =>
    opt?.id ??
    opt?.code ??
    opt?.districtCode ??
    opt?.municipalityCode ??
    opt?.stateCode ??
    String(opt?.name ?? "unnamed");

  const getId = (it) =>
    it?.id ?? it?.vendorId ?? it?.vendorID ?? it?.vendor_id ?? it?._id ?? null;

  // === FILTER & PAGINATION ===
  const filtered = vendors.filter((v) =>
    (v.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.contactPerson || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.email || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // === VALIDATION ===
  const validate = () => {
    const e = {};
    const l = form.location;

    if (!form.name.trim()) e.name = "Name required";
    if (!form.contactPerson.trim()) e.contactPerson = "Contact person required";
    if (!form.contactNumber.trim()) e.contactNumber = "Phone required";
    else if (!/^\+?\d{7,15}$/.test(form.contactNumber))
      e.contactNumber = "Invalid phone (7–15 digits)";
    if (!form.email.trim()) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";

    if (!l.country.trim()) e["location.country"] = "Country required";
    if (!l.addressLine1.trim()) e["location.addressLine1"] = "Address Line 1 required";
    if (!l.postalCode.trim()) e["location.postalCode"] = "Postal code required";
    else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(l.postalCode))
      e["location.postalCode"] = "Invalid postal";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleLoc = (field, value) => {
    const v = field === "wardNo" ? (value === "" ? 0 : Number(value)) : value;
    setForm((p) => ({
      ...p,
      location: { ...p.location, [field]: v },
    }));
    const key = `location.${field}`;
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  // === CRUD ===
  const startCreate = () => {
    setMode("form");
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    setSuccess(false);
  };

  const startEdit = async (v) => {
    setMode("form");
    const id = getId(v);
    setEditingId(id);
    setErrors({});
    setSuccess(false);
    setLoading(true);
    try {
      // fetch fresh vendor details from the API to populate the form fully
      const vendor = (id ? await VendorService.getById(id).catch(() => null) : null) || v;

      setForm({
        name: vendor.name ?? "",
        contactPerson: vendor.contactPerson ?? "",
        contactNumber: vendor.contactNumber ?? "",
        email: vendor.email ?? "",
        location: {
          country: vendor.location?.country ?? "",
          stateProvince: vendor.location?.stateProvince ?? "",
          district: vendor.location?.district ?? "",
          municipality: vendor.location?.municipality ?? "",
          municipalityType: vendor.location?.municipalityType ?? "",
          wardNo: vendor.location?.wardNo != null ? Number(vendor.location?.wardNo) : 0,
          addressLine1: vendor.location?.addressLine1 ?? "",
          addressLine2: vendor.location?.addressLine2 ?? "",
          postalCode: vendor.location?.postalCode ?? "",
          latitude: vendor.location?.latitude ?? "",
          longitude: vendor.location?.longitude ?? "",
        },
      });
    } catch (err) {
      handleError(err, { title: "Failed to load vendor details" });
      // fallback: populate from provided item
      setForm({
        name: v.name ?? "",
        contactPerson: v.contactPerson ?? "",
        contactNumber: v.contactNumber ?? "",
        email: v.email ?? "",
        location: {
          country: v.location?.country ?? "",
          stateProvince: v.location?.stateProvince ?? "",
          district: v.location?.district ?? "",
          municipality: v.location?.municipality ?? "",
          municipalityType: v.location?.municipalityType ?? "",
          wardNo: v.location?.wardNo != null ? Number(v.location?.wardNo) : 0,
          addressLine1: v.location?.addressLine1 ?? "",
          addressLine2: v.location?.addressLine2 ?? "",
          postalCode: v.location?.postalCode ?? "",
          latitude: v.location?.latitude ?? "",
          longitude: v.location?.longitude ?? "",
        },
      });
    } finally {
      setLoading(false);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  };

  const cancelForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(initialForm);
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
          wardNo: Number(form.location.wardNo),
          addressLine1: form.location.addressLine1.trim(),
          addressLine2: form.location.addressLine2.trim() || undefined,
          postalCode: form.location.postalCode.trim(),
          latitude: form.location.latitude.trim() || undefined,
          longitude: form.location.longitude.trim() || undefined,
        },
      };

      if (editingId) {
        // Update: send update, then fetch the updated vendor from server
        await VendorService.update(editingId, payload);
        // Refresh the list so changes are visible
        await fetchVendors({ pageNumber: page, pageSize });
        // Fetch the latest vendor data and populate the form to avoid clearing
        try {
          const updatedVendor = await VendorService.getById(editingId);
          const v = updatedVendor || {};
          setForm({
            name: v.name ?? form.name,
            contactPerson: v.contactPerson ?? form.contactPerson,
            contactNumber: v.contactNumber ?? form.contactNumber,
            email: v.email ?? form.email,
            location: {
              country: v.location?.country ?? form.location.country,
              stateProvince: v.location?.stateProvince ?? form.location.stateProvince,
              district: v.location?.district ?? form.location.district,
              municipality: v.location?.municipality ?? form.location.municipality,
              municipalityType: v.location?.municipalityType ?? form.location.municipalityType,
              wardNo: v.location?.wardNo != null ? Number(v.location?.wardNo) : Number(form.location.wardNo || 0),
              addressLine1: v.location?.addressLine1 ?? form.location.addressLine1,
              addressLine2: v.location?.addressLine2 ?? form.location.addressLine2,
              postalCode: v.location?.postalCode ?? form.location.postalCode,
              latitude: v.location?.latitude ?? form.location.latitude,
              longitude: v.location?.longitude ?? form.location.longitude,
            },
          });
        } catch (err) {
          // if fetching updated vendor fails, keep current form values
          handleError(err, { title: "Could not fetch updated vendor after save" });
        }
        setSuccess(true);
      } else {
        // Create: after creating, reset the form and go back to list view
        await VendorService.create(payload);
        setSuccess(true);
        setTimeout(() => {
          fetchVendors({ pageNumber: 1, pageSize });
          setMode("list");
          setEditingId(null);
          setForm(initialForm);
        }, 800);
      }
    } catch (err) {
      handleError(err, { title: "Save failed" });
      setErrors({ submit: err?.message || "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) {
      alert("Cannot delete vendor: missing identifier. Try refreshing the list.");
      return;
    }
    const id = deleteModal.id;
    setLoading(true);
    try {
      await VendorService.remove(id);
      await fetchVendors({ pageNumber: page, pageSize });
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      handleError(err, { title: "Delete failed" });
      const msg = err?.response?.data?._message || err?.response?.data?.message || err?.message || "Unknown";
      alert("Delete failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // === FOCUS ===
  useEffect(() => {
    if (mode === "form") setTimeout(() => nameInputRef.current?.focus(), 100);
  }, [mode]);

  // === FORM VIEW ===
  if (mode === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <BackButton onClick={cancelForm} />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {editingId ? "Edit Vendor" : "Add New Vendor"}
              </h1>
              <p className="text-slate-600 mt-1">
                {editingId ? "Update vendor details" : "Register a new vendor"}
              </p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Vendor saved successfully!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Vendor Details */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-slate-700" />
                  Vendor Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="ABC Suppliers"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base transition-all
                          focus:outline-none focus:ring-2 focus:ring-slate-500
                          ${errors.name ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.contactPerson}
                      onChange={(e) => handleChange("contactPerson", e.target.value)}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl border text-base transition-all
                        focus:outline-none focus:ring-2 focus:ring-slate-500
                        ${errors.contactPerson ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors.contactPerson && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.contactPerson}
                      </p>
                    )}
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
                        onChange={(e) => handleChange("contactNumber", e.target.value)}
                        placeholder="+977 9800000000"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base transition-all
                          focus:outline-none focus:ring-2 focus:ring-slate-500
                          ${errors.contactNumber ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors.contactNumber && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="vendor@example.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-base transition-all
                          focus:outline-none focus:ring-2 focus:ring-slate-500
                          ${errors.email ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="border-t pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-slate-700" />
                  Location Details
                </h2>
                {dropdownError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {dropdownError}
                  </div>
                )}
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
                        onChange={(e) => handleLoc("country", e.target.value)}
                        placeholder="Nepal"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border
                          ${errors["location.country"] ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State / Province
                      {dropdownLoading && (
                        <span className="ml-3 inline-flex items-center text-sm text-slate-500">
                          <Spinner className="w-4 h-4 mr-2" />
                          Loading...
                        </span>
                      )}
                    </label>
                    <select
                      value={form.location.stateProvince}
                      onChange={(e) => handleLoc("stateProvince", e.target.value)}
                      disabled={dropdownLoading}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="">{dropdownLoading ? "Loading..." : "Select"}</option>
                      {stateProvinces.map((s) => (
                        <option key={mapValue(s)} value={mapValue(s)}>
                          {mapLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      District
                      {dropdownLoading && (
                        <span className="ml-3 inline-flex items-center text-sm text-slate-500">
                          <Spinner className="w-4 h-4 mr-2" />
                          Loading...
                        </span>
                      )}
                    </label>
                    <select
                      value={form.location.district}
                      onChange={(e) => handleLoc("district", e.target.value)}
                      disabled={dropdownLoading}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="">{dropdownLoading ? "Loading..." : "Select"}</option>
                      {districts.map((d) => (
                        <option key={mapValue(d)} value={mapValue(d)}>
                          {mapLabel(d)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Municipality
                      {dropdownLoading && (
                        <span className="ml-3 inline-flex items-center text-sm text-slate-500">
                          <Spinner className="w-4 h-4 mr-2" />
                          Loading...
                        </span>
                      )}
                    </label>
                    <select
                      value={form.location.municipality}
                      onChange={(e) => handleLoc("municipality", e.target.value)}
                      disabled={dropdownLoading}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="">{dropdownLoading ? "Loading..." : "Select"}</option>
                      {municipalities.map((m) => (
                        <option key={mapValue(m)} value={mapValue(m)}>
                          {mapLabel(m)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Municipality Type</label>
                    <input
                      type="text"
                      value={form.location.municipalityType}
                      onChange={(e) => handleLoc("municipalityType", e.target.value)}
                      placeholder="Metropolitan"
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
                        onChange={(e) => handleLoc("wardNo", e.target.value)}
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
                        onChange={(e) => handleLoc("postalCode", e.target.value)}
                        placeholder="44600"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border
                          ${errors["location.postalCode"] ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.location.addressLine1}
                      onChange={(e) => handleLoc("addressLine1", e.target.value)}
                      placeholder="123 Main St"
                      className={`w-full px-4 py-3 rounded-xl border
                        ${errors["location.addressLine1"] ? "border-red-500" : "border-slate-300"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={form.location.addressLine2}
                      onChange={(e) => handleLoc("addressLine2", e.target.value)}
                      placeholder="Suite 100"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Latitude</label>
                    <input
                      type="text"
                      value={form.location.latitude}
                      onChange={(e) => handleLoc("latitude", e.target.value)}
                      placeholder="27.7172"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Longitude</label>
                    <input
                      type="text"
                      value={form.location.longitude}
                      onChange={(e) => handleLoc("longitude", e.target.value)}
                      placeholder="85.3240"
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
                <FormButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                  loadingText="Saving..."
                >
                  {editingId ? "Update Vendor" : "Create Vendor"}
                </FormButton>
                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={cancelForm}
                  disabled={loading}
                >
                  Cancel
                </FormButton>
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
            <p className="text-slate-600 mt-1">Manage all your vendors</p>
          </div>
          <ActionButton onClick={startCreate}>
            Add Vendor
          </ActionButton>
        </div>

        <div className="mb-6">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, contact, email..." />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {fetchLoading ? (
            <div className="p-16 text-center">
              <Spinner className="mx-auto mb-4" size={8} />
              <p className="text-slate-500">Loading vendors...</p>
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              icon={<Building2 className="w-12 h-12 text-slate-300" />}
              title="No vendors found"
              subtitle="Get started by adding your first vendor to the system."
              action={
                <ActionButton onClick={startCreate} size="sm">
                  Add your first vendor
                </ActionButton>
              }
            />
          ) : (
            <TableWrapper>
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Name</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Contact</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Email</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Location</th>
                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((v) => (
                    <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-slate-900">{v.name}</td>
                      <td className="px-6 py-5 text-slate-600">{v.contactPerson}</td>
                      <td className="px-6 py-5 text-slate-600">{v.email}</td>
                      <td className="px-6 py-5 text-slate-600">
                        <div className="max-w-xs">
                          <p className="truncate font-medium text-slate-900">{v.location?.addressLine1 || '-'}</p>
                          <p className="text-xs text-slate-500">
                            {v.location?.postalCode && `${v.location.postalCode}, `}
                            {v.location?.country || '-'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="font-medium">Province:</span> {v.location?.stateProvince || '-'}
                            <span className="mx-2">|</span>
                            <span className="font-medium">District:</span> {v.location?.district || '-'}
                            <span className="mx-2">|</span>
                            <span className="font-medium">Municipality:</span> {v.location?.municipality || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <IconActionButton
                            icon={Edit2}
                            variant="edit"
                            size="md"
                            onClick={() => startEdit(v)}
                            ariaLabel="Edit vendor"
                          />
                          <IconActionButton
                            icon={Trash2}
                            variant="delete"
                            size="md"
                            onClick={() => setDeleteModal({ open: true, id: getId(v), name: v.name })}
                            ariaLabel="Delete vendor"
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

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={page}
              pageCount={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
        title="Delete Vendor?"
        message={`Are you sure you want to permanently delete ${deleteModal.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
      />
    </div>
  );
}
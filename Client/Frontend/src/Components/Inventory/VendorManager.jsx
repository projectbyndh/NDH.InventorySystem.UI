import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useWarehouseStore from "../Store/Warehousestore";
import useLoginStore from "../Store/Loginstore";
import DropdownService from "../Api/Dropdown";
import React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Warehouse,
  Phone,
  Mail,
  MapPin,
  Home,
  Globe,
  Hash,
} from "lucide-react";

export default function WarehouseManager() {
  const navigate = useNavigate();
  const { token } = useLoginStore();
  const { warehouses, fetchWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } =
    useWarehouseStore();

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
    name: "",
    contactPerson: "",
    contactNumber: "",
    location: {
      country: "",
      stateProvince: "",
      district: "",
      municipality: "",
      wardNo: "",
      postalCode: "",
      addressLine1: "",
      addressLine2: "",
    },
  };
  const [form, setForm] = useState(initialForm);
  const nameInputRef = useRef(null);

  // === Dropdown State ===
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [stateProvinces, setStateProvinces] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(null);

  // === HELPER: Normalize API array responses ===
  const normalizeOptions = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.results)) return res.results;
    return [];
  };

  // === HELPER: Safely convert any value to string (recursive) ===
  const toText = (val) => {
    if (val == null) return "";
    if (typeof val === "string" || typeof val === "number") return String(val);
    if (typeof val === "object") {
      if ("en" in val) return String(val.en);
      if ("ne" in val) return String(val.ne);
      if ("np" in val) return String(val.np);
      if ("name" in val) return toText(val.name);
      if ("label" in val) return toText(val.label);
      return JSON.stringify(val);
    }
    return String(val);
  };

  // === MAPPER: Extract display label ===
  const mapOptionLabel = (opt) => {
    if (!opt) return "";
    const candidates = [
      opt.name,
      opt.provinceName,     // For StateProvince
      opt.districtName,
      opt.municipalityName,
      opt.stateName,
      opt.label,
      opt.text,
      opt.title,
      opt.description,
      opt.en,
      opt.ne,
      opt.np,
    ];
    const raw = candidates.find((c) => c != null);
    return toText(raw) || "Unnamed";
  };

  // dignidad MAPPER: Extract value (id/code) ===
  const mapOptionValue = (opt) => {
    if (!opt) return "";
    return (
      opt.id ??
      opt.value ??
      opt.code ??
      opt.districtCode ??
      opt.municipalityCode ??
      opt.stateCode ??
      toText(opt.name) ??
      "unnamed"
    );
  };

  // === Load Warehouses ===
  useEffect(() => {
    if (token) fetchWarehouses({ pageNumber: page, pageSize });
  }, [page, token, fetchWarehouses]);

  // === Load Dropdowns ===
  useEffect(() => {
    if (!token) return;

    const loadDropdowns = async () => {
      setDropdownLoading(true);
      setDropdownError(null);
      try {
        const [dRes, mRes, sRes] = await Promise.all([
          DropdownService.getDistricts(),
          DropdownService.getMunicipalities(),
          DropdownService.getStateProvinces(),
        ]);

        const districts = normalizeOptions(dRes);
        const municipalities = normalizeOptions(mRes);
        const stateProvinces = normalizeOptions(sRes);

        setDistricts(districts);
        setMunicipalities(municipalities);
        setStateProvinces(stateProvinces);

        // Optional: Debug once
        // console.log("Districts:", districts);
        // console.log("Municipalities:", municipalities);
        // console.log("State/Provinces:", stateProvinces);
      } catch (err) {
        const msg =
          err?.response?.data?._message ||
          err?.message ||
          "Failed to load location dropdowns";
        setDropdownError(msg);
        console.error("Dropdown load error:", err);
      } finally {
        setDropdownLoading(false);
      }
    };

    loadDropdowns();
  }, [token]);

  // === Focus on Form Load ===
  useEffect(() => {
    if (mode === "form") {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [mode]);

  // === Filter & Paginate Warehouses ===
  const filtered = warehouses.filter(
    (w) =>
      w.name?.toLowerCase().includes(search.toLowerCase()) ||
      w.contactPerson?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // === Validation ===
  const validate = () => {
    const e = {};
    const loc = form.location;

    if (!form.name.trim()) e.name = "Warehouse name required";
    if (!form.contactPerson.trim()) e.contactPerson = "Contact person required";
    if (!form.contactNumber.trim()) e.contactNumber = "Phone required";
    else if (!/^\+?\d{7,15}$/.test(form.contactNumber))
      e.contactNumber = "Invalid phone (7–15 digits)";

    if (!loc.country.trim()) e["location.country"] = "Country required";
    if (!loc.addressLine1.trim())
      e["location.addressLine1"] = "Address Line 1 required";
    if (!loc.postalCode.trim())
      e["location.postalCode"] = "Postal Code required";
    else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(loc.postalCode))
      e["location.postalCode"] = "Invalid postal code";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleLocationChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
    const key = `location.${field}`;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // === CRUD Actions ===
  const startCreate = () => {
    setMode("form");
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    setSuccess(false);
  };

  const startEdit = (wh) => {
    setMode("form");
    setEditingId(wh.id);
    setForm({
      name: wh.name || "",
      contactPerson: wh.contactPerson || "",
      contactNumber: wh.contactNumber || "",
      location: {
        country: wh.location?.country || "",
        stateProvince: wh.location?.stateProvince || "",
        district: wh.location?.district || "",
        municipality: wh.location?.municipality || "",
        wardNo: wh.location?.wardNo?.toString() || "",
        postalCode: wh.location?.postalCode || "",
        addressLine1: wh.location?.addressLine1 || "",
        addressLine2: wh.location?.addressLine2 || "",
      },
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
        location: {
          country: form.location.country.trim(),
          stateProvince: form.location.stateProvince.trim() || undefined,
          district: form.location.district.trim() || undefined,
          municipality: form.location.municipality.trim() || undefined,
          wardNo: form.location.wardNo ? parseInt(form.location.wardNo) : undefined,
          postalCode: form.location.postalCode.trim(),
          addressLine1: form.location.addressLine1.trim(),
          addressLine2: form.location.addressLine2.trim() || undefined,
        },
      };

      if (editingId) await updateWarehouse(editingId, payload);
      else await createWarehouse(payload);

      setSuccess(true);
      await fetchWarehouses({ pageNumber: 1, pageSize });
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
      await deleteWarehouse(deleteModal.id);
      await fetchWarehouses({ pageNumber: page, pageSize });
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
                {editingId ? "Edit Warehouse" : "Add New Warehouse"}
              </h1>
              <p className="text-slate-600 mt-1">
                {editingId ? "Update storage facility" : "Register a new storage facility"}
              </p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Warehouse saved successfully!</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* WAREHOUSE DETAILS */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Warehouse className="w-6 h-6 text-slate-700" />
                  Warehouse Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Warehouse Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Central Storage A"
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
                      placeholder="Raj Kumar"
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
                </div>
              </section>

              {/* LOCATION */}
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
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={form.location.country}
                        onChange={(e) => handleLocationChange("country", e.target.value)}
                        placeholder="Nepal"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border
                          ${errors["location.country"] ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors["location.country"] && (
                      <p className="mt-1 text-sm text-red-600">{errors["location.country"]}</p>
                    )}
                  </div>

                  {/* State / Province */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State / Province
                    </label>
                    <select
                      value={form.location.stateProvince}
                      onChange={(e) => handleLocationChange("stateProvince", e.target.value)}
                      disabled={dropdownLoading}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="">
                        {dropdownLoading ? "Loading..." : "Select state / province"}
                      </option>
                      {stateProvinces.map((sp) => {
                        const value = mapOptionValue(sp);
                        const label = mapOptionLabel(sp);
                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      District
                    </label>
                    <select
                      value={form.location.district}
                      onChange={(e) => handleLocationChange("district", e.target.value)}
                      disabled={dropdownLoading}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="">
                        {dropdownLoading ? "Loading..." : "Select district"}
                      </option>
                      {districts.map((d) => {
                        const value = mapOptionValue(d);
                        const label = mapOptionLabel(d);
                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Municipality */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Municipality
                    </label>
                    <select
                      value={form.location.municipality}
                      onChange={(e) => handleLocationChange("municipality", e.target.value)}
                      disabled={dropdownLoading}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="">
                        {dropdownLoading ? "Loading..." : "Select municipality"}
                      </option>
                      {municipalities.map((m) => {
                        const value = mapOptionValue(m);
                        const label = mapOptionLabel(m);
                        return (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Ward No */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ward No
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={form.location.wardNo}
                        onChange={(e) => handleLocationChange("wardNo", e.target.value)}
                        placeholder="10"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={form.location.postalCode}
                        onChange={(e) => handleLocationChange("postalCode", e.target.value)}
                        placeholder="44600"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border
                          ${errors["location.postalCode"] ? "border-red-500" : "border-slate-300"}`}
                      />
                    </div>
                    {errors["location.postalCode"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["location.postalCode"]}
                      </p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.location.addressLine1}
                      onChange={(e) => handleLocationChange("addressLine1", e.target.value)}
                      placeholder="123 Industrial Road"
                      className={`w-full px-4 py-3 rounded-xl border
                        ${errors["location.addressLine1"] ? "border-red-500" : "border-slate-300"}`}
                    />
                    {errors["location.addressLine1"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["location.addressLine1"]}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={form.location.addressLine2}
                      onChange={(e) => handleLocationChange("addressLine2", e.target.value)}
                      placeholder="Suite 100"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {errors.submit}
                </div>
              )}

              {/* Buttons */}
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
                    <>{editingId ? "Update Warehouse" : "Create Warehouse"}</>
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
  const totalPagesForList = totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Warehouse Management</h1>
            <p className="text-slate-600 mt-1">Manage all your storage facilities</p>
          </div>
          <button
            onClick={startCreate}
            className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold
                       hover:bg-black transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-6 h-6" />
            Add Warehouse
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, contact..."
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-slate-300 text-base
                         focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {paginated.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-slate-100 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Warehouse className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">No warehouses found.</p>
              <button
                onClick={startCreate}
                className="mt-4 text-slate-900 font-semibold hover:underline"
              >
                Add your first warehouse
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Name</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Contact</th>
                    <th className="text-left px-6 py-5 font-bold text-slate-700">Location</th>
                    <th className="text-right px-6 py-5 font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-5 font-semibold text-slate-900">{w.name}</td>
                      <td className="px-6 py-5 text-slate-600">{w.contactPerson}</td>
                      <td className="px-6 py-5 text-slate-600">
                        <div className="max-w-xs">
                          <p className="truncate">{w.location?.addressLine1}</p>
                          <p className="text-xs text-slate-500">
                            {w.location?.postalCode && `${w.location.postalCode}, `}
                            {w.location?.country}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(w)}
                            className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(w.id, w.name)}
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
        {totalPagesForList > 1 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-xl bg-white shadow hover:shadow-md disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-700 font-medium">
              Page <strong>{page}</strong> of <strong>{totalPagesForList}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPagesForList, p + 1))}
              disabled={page === totalPagesForList}
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
              <h3 className="text-2xl font-bold text-slate-900">Delete Warehouse?</h3>
            </div>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Are you sure you want to <strong>permanently delete</strong> warehouse:
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
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete Warehouse"}
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
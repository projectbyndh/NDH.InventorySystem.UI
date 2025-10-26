import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../Store/Productstore";
import useCategoryStore from "../Store/Categorystore"; // Assuming categoryStore exists for categoryId and subCategoryId

const required = <span className="text-red-500">*</span>;

function SectionCard({ title, right, children, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200">
        <h3 className="text-slate-900 font-semibold tracking-tight">{title}</h3>
        {right}
      </header>
      <div className="p-5 sm:p-6 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, required: req, children, hint }) {
  return (
    <label className="block">
      <div className="mb-1 text-[13px] font-medium text-slate-700">
        {label} {req ? required : null}
      </div>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-[15px] outline-none transition " +
        "placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400"
      }
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      rows={3}
      {...props}
      className={
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] outline-none transition " +
        "placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400"
      }
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [ref, onClose]);
}

function Select({ value, onChange, options, placeholder = "Choose one", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClose(ref, () => setOpen(false));

  const current = useMemo(() => options.find((o) => o.value === value), [options, value]);

  return (
    <div className={"relative " + className} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 px-3 rounded-xl border bg-white border-slate-300 text-left text-[15px] flex items-center justify-between"
      >
        <span className={current ? "text-slate-900" : "text-slate-400"}>
          {current ? current.label : placeholder}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer text-[15px] hover:bg-slate-50 ${
                o.value === value ? "bg-slate-50" : ""
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-left text-sm font-medium text-slate-700"
      >
        <span>{title}</span>
        <Chevron open={open} />
      </button>
      {open && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
}

function Chevron({ open }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 011.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
    </svg>
  );
}

export default function AddProductPage() {
  const { id } = useParams(); // Get product ID from URL for editing
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts, createProduct, updateProduct, getProductById } = useProductStore();
  const { categories } = useCategoryStore(); // Assuming categoryStore provides categories

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    quantityInStock: 0,
    minimumStockLevel: 0,
    reorderQuantity: 0,
    categoryId: 0,
    subCategoryId: 0,
    unitOfMeasureId: 0,
    primaryVendorId: 0,
    status: "Active",
    trackInventory: true,
    isSerialized: true,
    hasExpiry: true,
    variantGroupId: "",
    variants: [],
  });

  // Fetch products and categories on mount, load existing product for editing
  useEffect(() => {
    fetchProducts();
    if (id) {
      const fetchProduct = async () => {
        const product = await getProductById(parseInt(id));
        if (product) {
          setFormData({
            name: product.name || "",
            description: product.description || "",
            sku: product.sku || "",
            price: product.price || 0,
            cost: product.cost || 0,
            quantityInStock: product.quantityInStock || 0,
            minimumStockLevel: product.minimumStockLevel || 0,
            reorderQuantity: product.reorderQuantity || 0,
            categoryId: product.categoryId || 0,
            subCategoryId: product.subCategoryId || 0,
            unitOfMeasureId: product.unitOfMeasureId || 0,
            primaryVendorId: product.primaryVendorId || 0,
            status: product.status || "Active",
            trackInventory: product.trackInventory || true,
            isSerialized: product.isSerialized || true,
            hasExpiry: product.hasExpiry || true,
            variantGroupId: product.variantGroupId || "",
            variants: product.variants || [],
          });
        }
      };
      fetchProduct();
    }
  }, [id, fetchProducts, getProductById]);

  // Dynamic options
  const unitOfMeasureOptions = useMemo(() => [
    { value: "0", label: "Pieces (pcs)" },
    { value: "1", label: "Box" },
  ], []);
  const categoryOptions = useMemo(() => [
    { value: "0", label: "None" },
    ...(categories || []).map((cat) => ({ value: cat.id.toString(), label: cat.name })),
  ], [categories]);
  const subCategoryOptions = useMemo(() => [
    { value: "0", label: "None" },
    ...(categories || [])
      .flatMap((cat) => cat.subCategories || [])
      .map((subCat) => ({ value: subCat.id.toString(), label: subCat.name })),
  ], [categories]);
  const statusOptions = useMemo(() => [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ], []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) || 0 : value,
    }));
  };

  // Handle toggle changes
  const handleToggleChange = (name) => (checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      cost: Number(formData.cost) || 0,
      quantityInStock: Number(formData.quantityInStock) || 0,
      minimumStockLevel: Number(formData.minimumStockLevel) || 0,
      reorderQuantity: Number(formData.reorderQuantity) || 0,
      categoryId: Number(formData.categoryId) || 0,
      subCategoryId: Number(formData.subCategoryId) || 0,
      unitOfMeasureId: Number(formData.unitOfMeasureId) || 0,
      primaryVendorId: Number(formData.primaryVendorId) || 0,
    };

    try {
      if (id) {
        // Update existing product
        const success = await updateProduct(parseInt(id), payload);
        if (success) navigate("/products");
      } else {
        // Create new product
        const success = await createProduct(payload);
        if (success) {
          setFormData({
            name: "",
            description: "",
            sku: "",
            price: 0,
            cost: 0,
            quantityInStock: 0,
            minimumStockLevel: 0,
            reorderQuantity: 0,
            categoryId: 0,
            subCategoryId: 0,
            unitOfMeasureId: 0,
            primaryVendorId: 0,
            status: "Active",
            trackInventory: true,
            isSerialized: true,
            hasExpiry: true,
            variantGroupId: "",
            variants: [],
          });
        }
      }
    } catch (err) {
      // Error is already set in the store
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      sku: "",
      price: 0,
      cost: 0,
      quantityInStock: 0,
      minimumStockLevel: 0,
      reorderQuantity: 0,
      categoryId: 0,
      subCategoryId: 0,
      unitOfMeasureId: 0,
      primaryVendorId: 0,
      status: "Active",
      trackInventory: true,
      isSerialized: true,
      hasExpiry: true,
      variantGroupId: "",
      variants: [],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button onClick={() => navigate("/products")} className="hover:text-slate-900">
              ← Back to Product Master
            </button>
            <span className="text-slate-300">/</span>
            <span className="hidden sm:inline">Product Master</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900">{id ? "Edit Product" : "Add Product"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Collapsible title={<span className="text-sm font-medium">Additional Details</span>} defaultOpen={false} />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 mb-4">
          {id ? "Edit Product" : "Add Product"}
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            {error && <p className="text-red-500">{error}</p>}
            <SectionCard
              title="Basic Info"
              right={<button className="text-sm text-slate-700 hover:text-slate-900 flex items-center gap-2">+ Add Stock Unit</button>}
            >
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Product Name" required>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Wai Wai"
                      required
                    />
                  </Field>
                  <Field label="Product Code (SKU)">
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g., 123455"
                    />
                  </Field>
                  <Field label="Stock Unit" required>
                    <Select
                      name="unitOfMeasureId"
                      options={unitOfMeasureOptions}
                      value={formData.unitOfMeasureId.toString()}
                      onChange={(value) => setFormData((prev) => ({ ...prev, unitOfMeasureId: Number(value) }))}
                      placeholder="Choose product unit"
                    />
                  </Field>
                  <Field label="Product Categories" required>
                    <Select
                      name="categoryId"
                      options={categoryOptions}
                      value={formData.categoryId.toString()}
                      onChange={(value) => setFormData((prev) => ({ ...prev, categoryId: Number(value) }))}
                      placeholder="Choose product category"
                    />
                  </Field>
                  <Field label="Sub Categories">
                    <Select
                      name="subCategoryId"
                      options={subCategoryOptions}
                      value={formData.subCategoryId.toString()}
                      onChange={(value) => setFormData((prev) => ({ ...prev, subCategoryId: Number(value) }))}
                      placeholder="Choose product sub category"
                    />
                  </Field>
                  <Field label="Product Type" required>
                    <Select
                      name="status"
                      options={statusOptions}
                      value={formData.status}
                      onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                      placeholder="Choose product type"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Short Description" hint="e.g., This product is generally used for children">
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Write a short description..."
                      />
                    </Field>
                  </div>
                </div>
              </form>
            </SectionCard>

            <SectionCard
              title="Pricing & Tax"
              right={
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-700">VAT Include</span>
                  <Toggle checked={formData.trackInventory} onChange={handleToggleChange("trackInventory")} />
                </div>
              }
            >
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Purchase Price" required>
                    <Input
                      name="cost"
                      type="number"
                      value={formData.cost}
                      onChange={handleInputChange}
                      placeholder="e.g., 1230"
                      required
                    />
                  </Field>
                  <Field label="Retail Price (excluding VAT)" required>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 1234455"
                      required
                    />
                  </Field>
                </div>
              </form>
            </SectionCard>

            <SectionCard title="Barcode Mapping" right={<button className="text-sm text-slate-700 hover:text-slate-900 flex items-center gap-2">⌄</button>}>
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Barcode" required>
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g., 1230"
                      required
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-indigo-700"
                    >
                      + Add Barcode
                    </button>
                  </div>
                </div>
              </form>
            </SectionCard>

            <div className="flex flex-wrap items-center gap-3">
              <Select
                options={[{ value: "", label: "Additional Details" }, { value: "brand", label: "Brand & Attributes" }, { value: "seo", label: "SEO" }]}
                value={""}
                onChange={() => {}}
                className="w-56"
              />
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black disabled:opacity-50"
              >
                {loading ? "Saving..." : id ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
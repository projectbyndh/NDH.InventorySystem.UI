import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, AlertCircle, CheckCircle, DollarSign, Box, Barcode, Image as ImageIcon } from "lucide-react";
import useProductStore from "../../Store/Productstore";
import useCategoryStore from "../../Store/Categorystore";
import FormButton from "../../Ui/FormButton";
import PageHeader from "../../Ui/PageHeader";
import SectionCard from "../../Ui/SectionCard";
import { handleError } from "../../Ui/errorHandler";

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { products, createProduct, updateProduct, fetchProducts } = useProductStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [form, setForm] = useState({
        name: "",
        sku: "",
        description: "",
        price: 0,
        cost: 0,
        quantityInStock: 0,
        minimumStockLevel: 0,
        categoryId: null,
        trackInventory: true,
        isSerialized: false,
        hasExpiry: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (categories.length === 0) fetchCategories();
            if (isEdit) {
                if (products.length === 0) await fetchProducts({ pageSize: 100 });
                const p = products.find(prod => String(prod.id) === String(id));
                if (p) {
                    setForm({
                        name: p.name || "",
                        sku: p.sku || "",
                        description: p.description || "",
                        price: p.price || 0,
                        cost: p.cost || 0,
                        quantityInStock: p.quantityInStock || 0,
                        minimumStockLevel: p.minimumStockLevel || 0,
                        categoryId: p.categoryId || null,
                        trackInventory: !!p.trackInventory,
                        isSerialized: !!p.isSerialized,
                        hasExpiry: !!p.hasExpiry,
                    });
                }
            }
        };
        init();
    }, [id, isEdit, products, categories, fetchCategories, fetchProducts]);

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Product name is required";
        if (!form.sku.trim()) e.sku = "SKU is required";
        if (form.price <= 0) e.price = "Selling price must be greater than zero";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = { ...form, categoryId: form.categoryId ? Number(form.categoryId) : null };
            if (isEdit) await updateProduct(id, payload);
            else await createProduct(payload);
            setSuccess(true);
            setTimeout(() => navigate("/products"), 1200);
        } catch (err) {
            handleError(err);
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
            <PageHeader
                title={isEdit ? "Edit Product" : "New Inventory Item"}
                subtitle={isEdit ? "Manage product specifications and stock levels" : "Register a new stock keeping unit (SKU)"}
                showBack
                onBack={() => navigate("/products")}
                icon={Package}
            />

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-slideUp">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Product details saved successfully.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                <SectionCard title="Product Summary">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Item Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                placeholder="e.g. Wireless Mechanical Keyboard"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">SKU / Barcode <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.sku}
                                    onChange={(e) => handleFormChange("sku", e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.sku ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                    placeholder="SKU-8829-X"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Category</label>
                            <select
                                value={form.categoryId ?? ""}
                                onChange={(e) => handleFormChange("categoryId", e.target.value || null)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Pricing & Valuation">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Selling Price <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => handleFormChange("price", Number(e.target.value))}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.price ? "border-red-500" : "border-slate-300"} focus:ring-2 focus:ring-slate-500 outline-none`}
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Cost Price</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={form.cost}
                                    onChange={(e) => handleFormChange("cost", Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Inventory Control">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Quantity in Stock</label>
                            <div className="relative">
                                <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={form.quantityInStock}
                                    onChange={(e) => handleFormChange("quantityInStock", Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Low Stock Threshold</label>
                            <input
                                type="number"
                                value={form.minimumStockLevel}
                                onChange={(e) => handleFormChange("minimumStockLevel", Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-wrap gap-8 py-4">
                            <label className="inline-flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.trackInventory}
                                    onChange={(e) => handleFormChange("trackInventory", e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Track Inventory Levels</span>
                            </label>

                            <label className="inline-flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isSerialized}
                                    onChange={(e) => handleFormChange("isSerialized", e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Requires Serial Numbers</span>
                            </label>

                            <label className="inline-flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.hasExpiry}
                                    onChange={(e) => handleFormChange("hasExpiry", e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Track Expiry Dates</span>
                            </label>
                        </div>
                    </div>
                </SectionCard>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <FormButton type="submit" variant="primary" loading={loading} loadingText="Saving Product...">
                        {isEdit ? "Update Product" : "Save Product"}
                    </FormButton>
                    <FormButton type="button" variant="secondary" onClick={() => navigate("/products")} disabled={loading}>
                        Cancel
                    </FormButton>
                </div>
            </form>
        </div>
    );
}

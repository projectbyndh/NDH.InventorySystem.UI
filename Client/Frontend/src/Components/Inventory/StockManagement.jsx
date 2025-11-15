import React, { useState } from "react";
import SectionCard from "../UI/SectionCard";
import Field from "../UI/Field";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Collapsible from "../UI/Collapsible";

export default function StockManagementPage() {
  const [product, setProduct] = useState("");
  const productOptions = [
    { value: "waiwai", label: "Wai Wai" },
    { value: "chips", label: "Chips" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button className="hover:text-slate-900">← Back to Stock Management</button>
            <span className="text-slate-300">/</span>
            <span className="hidden sm:inline">Stock Management</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900">Manage Stock</span>
          </div>
          <div className="flex items-center gap-3">
            <Collapsible title={<span className="text-sm font-medium">Additional Details</span>} defaultOpen={false} />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 mb-4">Manage Stock</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <SectionCard
              title="Stock Details"
              right={<button className="text-sm text-slate-700 hover:text-slate-900 flex items-center gap-2">+ Add Stock Entry</button>}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Product" required>
                  <Select
                    options={productOptions}
                    value={product}
                    onChange={setProduct}
                    placeholder="Choose product"
                  />
                </Field>
                <Field label="Stock Quantity" required>
                  <Input placeholder="e.g., 100" inputMode="numeric" />
                </Field>
                <Field label="Stock Unit" required>
                  <Select
                    options={[{ value: "pcs", label: "Pieces (pcs)" }, { value: "box", label: "Box" }]}
                    value=""
                    onChange={() => {}}
                    placeholder="Choose stock unit"
                  />
                </Field>
                <Field label="Warehouse">
                  <Select
                    options={[{ value: "main", label: "Main Warehouse" }, { value: "secondary", label: "Secondary Warehouse" }]}
                    value=""
                    onChange={() => {}}
                    placeholder="Choose warehouse"
                  />
                </Field>
                <Field label="Minimum Stock Level" hint="e.g., Minimum stock to trigger restock alert">
                  <Input placeholder="e.g., 10" inputMode="numeric" />
                </Field>
              </div>
            </SectionCard>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black">
                Save
              </button>
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
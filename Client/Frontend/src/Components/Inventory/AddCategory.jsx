// src/Components/Inventory/CategoryForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryService from "../Api/Categoryapi";

const required = <span className="text-red-500">*</span>;

function Input(props){ return <input {...props} className={"w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-[15px] outline-none focus:ring-2 focus:ring-slate-900/5 "+(props.className||"")} />; }
function Textarea(props){ return <textarea {...props} rows={3} className={"w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-slate-900/5 "+(props.className||"")} />; }

function Select({ value, onChange, options, placeholder="Choose one" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{ const f=(e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false);}; document.addEventListener("mousedown", f); return ()=>document.removeEventListener("mousedown", f); },[]);
  const current = useMemo(()=> options.find(o=>String(o.value)===String(value)), [options, value]);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={()=>setOpen(v=>!v)} className="w-full h-10 px-3 rounded-xl border bg-white border-slate-300 text-left text-[15px] flex items-center justify-between">
        <span className={current?"text-slate-900":"text-slate-400"}>{current?current.label:placeholder}</span>
        <svg className={`h-4 w-4 transition-transform ${open?"rotate-180":""}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 1.04 1.08l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.31a.75.75 0 0 1 .02-1.1z"/></svg>
      </button>
      {open && (
        <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((o)=>(
            <li key={o.value} onClick={()=>{onChange(o.value); setOpen(false);}} className={`px-3 py-2 cursor-pointer text-[15px] hover:bg-slate-50 ${String(o.value)===String(value)?"bg-slate-50":""}`}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CategoryForm({ initial, onSaved, onCancel }) {
  const editingId = initial?.id ?? initial?.categoryId;

  // DTO fields
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");        // ← stays as string
  const [parentCategoryId, setParentCategoryId] = useState(String(initial?.parentCategoryId ?? "0"));
  const [hasVariants, setHasVariants] = useState(Boolean(initial?.hasVariants ?? false));
  const [requiresSerialNumbers, setRequiresSerialNumbers] = useState(Boolean(initial?.requiresSerialNumbers ?? false));
  const [trackExpiration, setTrackExpiration] = useState(Boolean(initial?.trackExpiration ?? false));
  const [defaultUnitOfMeasure, setDefaultUnitOfMeasure] = useState(initial?.defaultUnitOfMeasure ?? "");
  const [taxonomyPath, setTaxonomyPath] = useState(initial?.taxonomyPath ?? "");
  const [hierarchyLevel, setHierarchyLevel] = useState(Number.isFinite(initial?.hierarchyLevel) ? Number(initial?.hierarchyLevel) : 0);
  const [subCategoriesInput, setSubCategoriesInput] = useState(Array.isArray(initial?.subCategories) ? initial.subCategories.join(", ") : "");

  // 🔽 NEW: local preview state for uploaded file
  const [preview, setPreview] = useState(initial?.imageUrl || "");

  // Build parent options
  const [parentOptions, setParentOptions] = useState([{ value: "0", label: "None (Top-level Category)" }]);
  const [loadingParents, setLoadingParents] = useState(false);

  const unitOptions = useMemo(()=>[
    { value: "", label: "None" },
    { value: "pcs", label: "Piece" },
    { value: "kg",  label: "Kilogram" },
    { value: "g",   label: "Gram" },
    { value: "ltr", label: "Liter" },
    { value: "box", label: "Box" },
  ], []);

  useEffect(()=> {
    (async ()=>{
      setLoadingParents(true);
      try {
        const data = await CategoryService.getAll({ pageNumber:1, pageSize:100 });
        const list = data?.items ?? data ?? [];
        setParentOptions([{value:"0", label:"None (Top-level Category)"},
          ...list.map(c=>({ value:String(c.id ?? c.categoryId ?? 0), label:c.name ?? `Category ${c.id}` }))
        ]);
      } catch (e) {
        console.warn("Failed to load parent categories", e);
      } finally {
        setLoadingParents(false);
      }
    })();
  },[]);

  // 🔽 NEW: file → base64 (data URL) helper
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);       // result is "data:<mime>;base64,...."
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // 🔽 NEW: handle local file selection (sets preview + imageUrl as base64)
  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(URL.createObjectURL(file));  // fast local preview (blob URL)
      setImageUrl(String(dataUrl));           // what we send to API (fits your JSON DTO)
    } catch (err) {
      console.error("Failed to read file", err);
    }
  };

  // 🔽 If user types/pastes a URL manually, update both imageUrl and preview
  const onTypeImageUrl = (url) => {
    setImageUrl(url);
    setPreview(url);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const subCategories = subCategoriesInput.split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      name: name.trim(),
      code: code.trim() || undefined,
      description: description.trim() || undefined,
      imageUrl: imageUrl || undefined,                  // <-- may be base64 data URL or http(s) URL
      parentCategoryId: Number(parentCategoryId) || 0,
      hasVariants,
      requiresSerialNumbers,
      trackExpiration,
      defaultUnitOfMeasure: defaultUnitOfMeasure || undefined,
      taxonomyPath: taxonomyPath.trim() || undefined,
      hierarchyLevel: Number.isFinite(hierarchyLevel) ? Number(hierarchyLevel) : 0,
      subCategories,
    };

    const res = editingId
      ? await CategoryService.update(editingId, payload)
      : await CategoryService.create(payload);

    onSaved?.(res);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Category Name {required}</div>
          <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Beverages" required />
        </label>

        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Category Code</div>
          <Input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="e.g., BEV001" />
        </label>

        <label className="block sm:col-span-2">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Description</div>
          <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Write a description..." />
        </label>

        {/* 🔽 NEW: Choose file + URL fallback + preview */}
        <div className="sm:col-span-2 grid gap-3">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="mb-1 text-[13px] font-medium text-slate-700">Upload Image</div>
              <input
                type="file"
                accept="image/*"
                onChange={onPickImage}
                className="block w-full text-[15px]"
              />
            </label>
            <label className="block">
              <div className="mb-1 text-[13px] font-medium text-slate-700">or Image URL</div>
              <Input
                value={imageUrl}
                onChange={(e)=>onTypeImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </label>
          </div>

          {preview ? (
            <div className="flex items-center gap-3">
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 rounded-lg border object-cover"
              />
              <span className="text-sm text-slate-500">Preview</span>
            </div>
          ) : null}
        </div>

        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Parent Category</div>
          <Select
            options={parentOptions}
            value={parentCategoryId}
            onChange={setParentCategoryId}
            placeholder={loadingParents ? "Loading..." : "Choose parent"}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Default Unit of Measure</div>
          <Select options={unitOptions} value={defaultUnitOfMeasure} onChange={setDefaultUnitOfMeasure} placeholder="None" />
        </label>

        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Taxonomy Path</div>
          <Input value={taxonomyPath} onChange={(e)=>setTaxonomyPath(e.target.value)} placeholder="e.g., root/beverages" />
        </label>

        <label className="block">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Hierarchy Level</div>
          <Input type="number" min={0} step={1} value={hierarchyLevel} onChange={(e)=>setHierarchyLevel(Number(e.target.value))} placeholder="0" />
        </label>

        <label className="block sm:col-span-2">
          <div className="mb-1 text-[13px] font-medium text-slate-700">Subcategories (comma-separated)</div>
          <Input value={subCategoriesInput} onChange={(e)=>setSubCategoriesInput(e.target.value)} placeholder="e.g., Soda, Juice, Water" />
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hasVariants} onChange={()=>setHasVariants(v=>!v)} /> Has Variants
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={requiresSerialNumbers} onChange={()=>setRequiresSerialNumbers(v=>!v)} /> Requires Serial Numbers
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trackExpiration} onChange={()=>setTrackExpiration(v=>!v)} /> Track Expiration
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          {editingId ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, b as useAuth, B as Button, t as toast, s as supabase } from "./router-DGN8uIPq.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const DEFAULT_MAX_MB = 25;
const ALLOWED_MIME = /* @__PURE__ */ new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/dxf",
  "image/vnd.dxf",
  "application/octet-stream"
  // fallback for DXF/DWG; size-validated
]);
const FORBIDDEN_EXT = /\.(exe|bat|cmd|sh|js|mjs|ts|com|msi|dll|scr|jar|ps1|vbs|html?)$/i;
function sanitizeName(name) {
  return name.replace(/[\\/]/g, "_").replace(/[^\w.\-() ]+/g, "_").replace(/\s+/g, "_").slice(0, 180);
}
function FileUploader({
  procedureId,
  onUploaded,
  bucket: bucketProp,
  folder,
  table: tableProp,
  recordIdColumn,
  recordId,
  accept,
  hint,
  maxSizeMb = DEFAULT_MAX_MB
}) {
  const { profile, user } = useAuth();
  const ref = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const bucket = bucketProp ?? "procedure-files";
  const table = tableProp ?? "procedure_attachments";
  const idCol = recordIdColumn ?? "procedure_id";
  const id = recordId ?? procedureId;
  const sub = folder ?? id ?? "misc";
  const maxBytes = maxSizeMb * 1024 * 1024;
  const onFiles = async (files) => {
    if (!files || !files.length || !profile?.company_id || !id) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      if (file.size > maxBytes) {
        toast.error(`${file.name}: exceeds ${maxSizeMb} MB limit.`);
        continue;
      }
      if (FORBIDDEN_EXT.test(file.name)) {
        toast.error(`${file.name}: file type not permitted.`);
        continue;
      }
      if (file.type && !ALLOWED_MIME.has(file.type)) {
        toast.error(`${file.name}: ${file.type || "unknown type"} not permitted.`);
        continue;
      }
      const safeName = sanitizeName(file.name);
      const path = `${profile.company_id}/${sub}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type || void 0 });
      if (upErr) {
        toast.error(`${file.name}: ${upErr.message}`);
        continue;
      }
      const row = {
        company_id: profile.company_id,
        filename: safeName,
        storage_path: path,
        mime_type: file.type || null,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null
      };
      row[idCol] = id;
      const { error: dbErr } = await supabase.from(table).insert(row);
      if (dbErr) {
        await supabase.storage.from(bucket).remove([path]).catch(() => {
        });
        toast.error(dbErr.message);
        continue;
      }
    }
    setBusy(false);
    if (ref.current) ref.current.value = "";
    onUploaded?.();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.preventDefault();
        onFiles(e.dataTransfer.files);
      },
      className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground bg-muted/20 hover:bg-muted/30 transition",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-5 mx-auto mb-2 text-muted-foreground" }),
        "Drag & drop files here, or",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "link", size: "sm", disabled: busy, onClick: () => ref.current?.click(), className: "px-1", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "browse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref, type: "file", multiple: true, accept, className: "hidden", onChange: (e) => onFiles(e.target.files) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] mt-1", children: hint ?? `PDF, drawings, certificates — up to ${maxSizeMb} MB each.` })
      ]
    }
  );
}
export {
  FileUploader as F,
  Upload as U
};

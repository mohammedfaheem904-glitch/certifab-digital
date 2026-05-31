import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, g as useQueryClient, B as Button, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { B as Building2 } from "./building-2-CNolPY5a.js";
import { G as Globe } from "./globe-BYBAGMtD.js";
import { M as Mail } from "./mail-Dc31eyoT.js";
import { S as Save } from "./save-Br-gy0vX.js";
import { F as FolderKanban } from "./folder-kanban-BIlSTZgZ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./plus-qnEZmAjm.js";
function CompaniesAdmin() {
  const {
    profile,
    roles,
    refresh
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const cid = profile?.company_id ?? null;
  const qc = useQueryClient();
  const {
    data: company,
    isLoading
  } = useQuery({
    queryKey: ["admin-company", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("companies").select("id, name, dedicated_domain, allowed_email_domains, logo_url, report_footer, email_from_name, country, industry, plan, created_at").eq("id", cid).maybeSingle();
      if (error) throw error;
      return data ?? null;
    }
  });
  const {
    data: projects
  } = useQuery({
    queryKey: ["admin-company-projects", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("projects").select("id, code, name, status, description, created_at").eq("company_id", cid).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const [form, setForm] = reactExports.useState({});
  const [allowedRaw, setAllowedRaw] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name,
      dedicated_domain: company.dedicated_domain,
      logo_url: company.logo_url,
      report_footer: company.report_footer,
      email_from_name: company.email_from_name,
      country: company.country,
      industry: company.industry
    });
    setAllowedRaw((company.allowed_email_domains ?? []).join(", "));
  }, [company]);
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-8 mx-auto text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Restricted area" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "The Companies admin is available to super-admins only." })
    ] });
  }
  const set = (k, v) => setForm((s) => ({
    ...s,
    [k]: v
  }));
  const save = async () => {
    if (!cid) return;
    setBusy(true);
    const allowed = allowedRaw.split(/[\s,;]+/).map((d) => d.trim().toLowerCase()).filter(Boolean);
    const {
      error
    } = await supabase.from("companies").update({
      name: form.name?.trim() || null,
      dedicated_domain: form.dedicated_domain?.trim().toLowerCase() || null,
      allowed_email_domains: allowed,
      logo_url: form.logo_url || null,
      report_footer: form.report_footer || null,
      email_from_name: form.email_from_name || null,
      country: form.country || null,
      industry: form.industry || null
    }).eq("id", cid);
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "That dedicated domain is already claimed." : error.message);
      return;
    }
    toast.success("Company profile updated.");
    qc.invalidateQueries({
      queryKey: ["admin-company", cid]
    });
    refresh();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Companies", subtitle: "Manage your workspace company profile, domains, and project portfolio.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-6", children: [
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
      " Loading company…"
    ] }),
    company && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex items-center gap-4", children: [
        company.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: company.logo_url, alt: company.name, className: "size-14 rounded-md object-cover border border-border bg-background" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-md grid place-items-center bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold tracking-tight truncate", children: company.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-muted text-muted-foreground", children: company.plan })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
            company.dedicated_domain ?? "No dedicated domain",
            " · Created ",
            new Date(company.created_at).toLocaleDateString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border flex items-center gap-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4 text-primary" }),
          " Company profile"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Company name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name ?? "", onChange: (e) => set("name", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Industry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.industry ?? "", onChange: (e) => set("industry", e.target.value), placeholder: "Oil & Gas, EPC, Fabrication…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Country", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.country ?? "", onChange: (e) => set("country", e.target.value), placeholder: "UAE" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Logo URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.logo_url ?? "", onChange: (e) => set("logo_url", e.target.value), placeholder: "https://…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Report footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.report_footer ?? "", onChange: (e) => set("report_footer", e.target.value), placeholder: "Confidential — © 2026" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Email from name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.email_from_name ?? "", onChange: (e) => set("email_from_name", e.target.value), placeholder: "Weld Yard System" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border flex items-center gap-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-4 text-primary" }),
          " Domain & email whitelisting"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(F, { label: "Dedicated domain", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.dedicated_domain ?? "", onChange: (e) => set("dedicated_domain", e.target.value), placeholder: "dwm.weldyard.com" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: "When users open this host, branding loads and signups land here." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(F, { label: "Allowed email domains", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: allowedRaw, onChange: (e) => setAllowedRaw(e.target.value), placeholder: "weldyard.com, contractors.weldyard.com" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3" }),
              " Comma-separated. Matching signups auto-join as client viewers."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: save, disabled: busy, children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 me-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 me-1" }),
        "Save changes"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "size-4 text-primary" }),
            " Projects (",
            projects?.length ?? 0,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/projects", children: "Manage projects →" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Created" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            (projects?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10 text-center text-sm text-muted-foreground", children: "No projects yet." }) }),
            projects?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: p.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground max-w-[360px] truncate", title: p.description ?? "", children: p.description ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: new Date(p.created_at).toLocaleDateString() })
            ] }, p.id))
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children });
}
function F({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  CompaniesAdmin as component
};

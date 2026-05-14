import { ReactNode, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { docNumber, shortHash, fmtEngDate } from "@/lib/doc-number";

export type Signatory = {
  role: string;
  name?: string | null;
  date?: string | null;
  /** Optional signature label (e.g., "Electronically signed", "QA Stamp #123"). */
  signature?: string | null;
};

export type ApprovalEntry = {
  action: string;
  actor_name?: string | null;
  actor_role?: string | null;
  signed_at?: string | null;
  comment?: string | null;
};

export type RevisionEntry = {
  revision: string;
  date?: string | null;
  by?: string | null;
  summary?: string | null;
};

export type MetaItem = { label: string; value: ReactNode };

type Status = string | undefined;

function watermarkFor(status: Status): string | null {
  if (!status) return null;
  const s = status.toUpperCase();
  if (s === "DRAFT") return "DRAFT";
  if (s === "REVIEW" || s === "PENDING") return "FOR REVIEW";
  if (s === "REJECTED") return "REJECTED";
  if (s === "REVOKED" || s === "OBSOLETE") return "OBSOLETE";
  return null;
}

export function ReportShell({
  title,
  subtitle,
  docType = "RPT",
  entityId,
  documentNumber,
  revision = "Rev 0",
  status,
  filters,
  onExportExcel,
  signatories,
  verifyUrl,
  showWatermark,
  watermarkText,
  meta,
  projectMeta,
  traceability,
  revisionHistory,
  approvalHistory,
  auditRefs,
  classification = "Internal · Controlled",
  children,
}: {
  title: string;
  subtitle?: string;
  docType?: string;
  /** Stable record id used to derive the document number. */
  entityId?: string;
  documentNumber?: string;
  revision?: string;
  status?: string;
  filters?: ReactNode;
  onExportExcel?: () => void;
  signatories?: Signatory[];
  verifyUrl?: string;
  showWatermark?: boolean;
  watermarkText?: string;
  meta?: MetaItem[];
  /** Project / client identification block printed under the header. */
  projectMeta?: MetaItem[];
  /** Traceability references (weld no, joint, drawing, heat number, line, spool…). */
  traceability?: MetaItem[];
  /** Revision control table. */
  revisionHistory?: RevisionEntry[];
  /** Approval / signature history (audit trail of e-signatures). */
  approvalHistory?: ApprovalEntry[];
  /** Cross-references to audit log records or other traceable docs. */
  auditRefs?: MetaItem[];
  classification?: string;
  children: ReactNode;
}) {
  const { companyName, companyLogo, reportFooter, profile, user } = useAuth();
  const docNo = useMemo(
    () => documentNumber ?? docNumber(docType, entityId),
    [documentNumber, docType, entityId],
  );
  const verify = verifyUrl ?? (typeof window !== "undefined"
    ? `${window.location.origin}/verify/doc/${shortHash(docNo + (companyName ?? ""))}`
    : `https://weldyard.app/verify/doc/${shortHash(docNo)}`);
  const generated = new Date();
  const sigs: Signatory[] = signatories ?? [
    { role: "Prepared by", name: profile?.display_name ?? user?.email ?? "" },
    { role: "Reviewed by" },
    { role: "Approved by" },
  ];

  const autoMark = showWatermark ?? Boolean(watermarkFor(status));
  const mark = watermarkText ?? watermarkFor(status) ?? "DRAFT";

  return (
    <div className="space-y-4">
      {/* Toolbar — screen only */}
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <Link to="/app/reports" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3" /> All reports
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-mono px-2 py-0.5 rounded bg-muted/60">{docNo}</span>
            <span>·</span><span>{revision}</span>
            {status && (<><span>·</span><span className="uppercase tracking-wider">{status}</span></>)}
            <span>·</span><span>{classification}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {filters}
          {onExportExcel && (
            <Button variant="outline" size="sm" onClick={onExportExcel}>
              <FileSpreadsheet className="size-4 me-1" /> Excel
            </Button>
          )}
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-4 me-1" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* The A4 sheet */}
      <div className="doc-sheet doc-content print:!shadow-none print:!border-0 print:!p-0 print:!max-w-none">
        {autoMark && (
          <div className="doc-watermark hidden print:block">{mark.toUpperCase()}</div>
        )}

        {/* Document header */}
        <header className="doc-header border-b-2 border-foreground pb-3 mb-3 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyLogo}
                alt={`${companyName ?? "Workspace"} logo`}
                className="h-12 w-auto max-w-[140px] object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className="size-12 rounded-md grid place-items-center"
                style={{ background: "linear-gradient(135deg,#b45309,#f59e0b)", color: "#fff", fontWeight: 800 }}
              >
                {(companyName ?? "WY").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Engineering · Quality Assurance Document
              </div>
              <div className="text-base font-semibold leading-tight">{companyName ?? "Workspace"}</div>
              <div className="text-[11pt] font-bold mt-0.5">{title}</div>
              {subtitle && <div className="text-[9.5pt] text-muted-foreground">{subtitle}</div>}
            </div>
          </div>
          <div className="text-end text-[10px] leading-tight">
            <table className="text-[9.5px] border-collapse">
              <tbody>
                <Row label="Doc No." value={<span className="font-mono">{docNo}</span>} />
                <Row label="Revision" value={revision} />
                {status && <Row label="Status" value={status} />}
                <Row label="Issued" value={fmtEngDate(generated)} />
                <Row label="Classification" value={classification} />
              </tbody>
            </table>
          </div>
        </header>

        {/* Project / client identification */}
        {projectMeta && projectMeta.length > 0 && (
          <SectionTitle index={1} title="Project Identification" />
        )}
        {projectMeta && projectMeta.length > 0 && (
          <KvGrid items={projectMeta} cols={3} className="mb-4" />
        )}

        {/* Traceability */}
        {traceability && traceability.length > 0 && (
          <>
            <SectionTitle index={2} title="Traceability References" />
            <KvGrid items={traceability} cols={4} className="mb-4" />
          </>
        )}

        {/* Optional generic meta strip */}
        {meta && meta.length > 0 && (
          <KvGrid items={meta} cols={4} className="mb-4" />
        )}

        {/* Body */}
        <main className="space-y-4">{children}</main>

        {/* Revision history */}
        {revisionHistory && revisionHistory.length > 0 && (
          <section className="mt-6 avoid-break">
            <SectionTitle title="Revision Control" />
            <table className="w-full">
              <thead>
                <tr><th>Rev</th><th>Date</th><th>Prepared by</th><th>Change summary</th></tr>
              </thead>
              <tbody>
                {revisionHistory.map((r, i) => (
                  <tr key={i}>
                    <td className="font-medium">{r.revision}</td>
                    <td>{fmtEngDate(r.date)}</td>
                    <td>{r.by ?? "—"}</td>
                    <td>{r.summary ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Approval history (e-signature trail) */}
        {approvalHistory && approvalHistory.length > 0 && (
          <section className="mt-6 avoid-break">
            <SectionTitle title="Approval History" />
            <table className="w-full">
              <thead>
                <tr><th>Action</th><th>Performed by</th><th>Role</th><th>Date / Time</th><th>Comment</th></tr>
              </thead>
              <tbody>
                {approvalHistory.map((a, i) => (
                  <tr key={i}>
                    <td className="uppercase font-medium">{a.action}</td>
                    <td>{a.actor_name ?? "—"}</td>
                    <td>{a.actor_role ?? "—"}</td>
                    <td className="font-mono text-[9.5pt]">{a.signed_at ? new Date(a.signed_at).toLocaleString() : "—"}</td>
                    <td>{a.comment ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Signature block */}
        <section className="mt-6 avoid-break">
          <SectionTitle title="Approvals & Signatures" icon={<ShieldCheck className="size-3" />} />
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {sigs.map((s) => (
                  <th key={s.role} className="text-start">{s.role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {sigs.map((s, i) => (
                  <td key={i} className="align-top" style={{ height: 56 }}>
                    <div className="text-[9px] uppercase text-muted-foreground">Name</div>
                    <div className="font-medium min-h-[12pt]">{s.name ?? ""}</div>
                  </td>
                ))}
              </tr>
              <tr>
                {sigs.map((s, i) => (
                  <td key={i} className="align-top">
                    <div className="text-[9px] uppercase text-muted-foreground">Signature</div>
                    <div className="min-h-[26pt] border-b border-foreground/40 italic text-[10pt] text-muted-foreground">
                      {s.signature ?? ""}
                    </div>
                    <div className="text-[9px] uppercase text-muted-foreground mt-1">
                      Date: <span className="font-mono normal-case">{s.date ? fmtEngDate(s.date) : "______________"}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {/* Audit refs */}
        {auditRefs && auditRefs.length > 0 && (
          <section className="mt-6 avoid-break text-[9pt]">
            <SectionTitle title="Audit References" />
            <KvGrid items={auditRefs} cols={3} />
          </section>
        )}

        {/* Footer with QR + traceability hash */}
        <footer className="mt-6 pt-3 border-t border-foreground/40 flex items-center justify-between gap-4 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 border border-foreground/30 rounded">
              <QRCodeSVG value={verify} size={56} />
            </div>
            <div>
              <div className="font-semibold text-foreground">Scan to verify authenticity</div>
              <div className="break-all">{verify}</div>
              <div>SHA: <span className="font-mono">{shortHash(docNo + verify, 12)}</span></div>
            </div>
          </div>
          <div className="text-end">
            <div>Generated {generated.toLocaleString()}</div>
            <div>By {profile?.display_name || user?.email}</div>
            {reportFooter && <div className="mt-0.5 italic max-w-[280px]">{reportFooter}</div>}
            <div className="mt-0.5">Document is controlled when issued with signatures · uncontrolled when printed</div>
            <div className="font-mono text-[8.5pt] opacity-70">Page <span className="page-num" /> · Issued under {classification}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <tr>
      <td className="pe-2 text-muted-foreground uppercase tracking-wider" style={{ fontSize: 8 }}>{label}</td>
      <td className="font-medium">{value}</td>
    </tr>
  );
}

export function SectionTitle({ title, index, icon }: { title: string; index?: number; icon?: ReactNode }) {
  return (
    <div className="text-[10.5pt] font-semibold uppercase tracking-wider mb-1.5 mt-2 bg-muted px-2 py-1 border border-foreground/40 flex items-center gap-2 avoid-break">
      {icon}
      <span>{index != null ? `${index}. ` : ""}{title}</span>
    </div>
  );
}

export function KvGrid({ items, cols = 4, className = "" }: { items: MetaItem[]; cols?: 2 | 3 | 4; className?: string }) {
  const colsClass = cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <div className={`grid ${colsClass} gap-0 border border-foreground/70 avoid-break ${className}`}>
      {items.map((m, i) => (
        <div
          key={i}
          className="border-e border-b border-foreground/30 last:border-e-0 px-3 py-2 text-[10pt]"
        >
          <div className="uppercase tracking-wider text-[8.5pt] text-muted-foreground">{m.label}</div>
          <div className="font-medium mt-0.5">{m.value ?? "—"}</div>
        </div>
      ))}
    </div>
  );
}

/** Two-column key/value table — preferred for ASME-style WPS variable groups. */
export function KvTable({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <table className="w-full">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th style={{ width: "32%" }}>{k}</th>
            <td>{v == null || v === "" ? "—" : v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { ReactNode, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { docNumber, shortHash } from "@/lib/doc-number";

export type Signatory = {
  role: string;
  name?: string | null;
  date?: string | null;
};

export function ReportShell({
  title,
  subtitle,
  docType = "RPT",
  documentNumber,
  revision = "Rev 0",
  status,
  filters,
  onExportExcel,
  signatories,
  verifyUrl,
  showWatermark = false,
  watermarkText,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  docType?: string;
  documentNumber?: string;
  revision?: string;
  status?: string;
  filters?: ReactNode;
  onExportExcel?: () => void;
  signatories?: Signatory[];
  verifyUrl?: string;
  showWatermark?: boolean;
  watermarkText?: string;
  meta?: { label: string; value: ReactNode }[];
  children: ReactNode;
}) {
  const { companyName, profile, user } = useAuth();
  const docNo = useMemo(() => documentNumber ?? docNumber(docType), [documentNumber, docType]);
  const verify = verifyUrl ?? (typeof window !== "undefined"
    ? `${window.location.origin}/verify/doc/${shortHash(docNo + (companyName ?? ""))}`
    : `https://weldyard.app/verify/doc/${shortHash(docNo)}`);
  const generated = new Date();
  const sigs: Signatory[] = signatories ?? [
    { role: "Prepared by", name: profile?.display_name ?? user?.email ?? "" },
    { role: "Reviewed by" },
    { role: "Approved by" },
  ];

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

      {/* The A4 sheet — visible on screen as a preview, also drives print */}
      <div className="doc-sheet doc-content print:!shadow-none print:!border-0 print:!p-0 print:!max-w-none">
        {showWatermark && (
          <div className="doc-watermark hidden print:block">
            {watermarkText ?? (status ?? "DRAFT").toUpperCase()}
          </div>
        )}

        {/* Document header — repeats on every printed page via thead trick on first table is impossible,
            so we keep a strong header block at the top that prints on page 1. */}
        <header className="doc-header border-b-2 border-foreground pb-3 mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-12 rounded-md grid place-items-center" style={{ background: "linear-gradient(135deg,#b45309,#f59e0b)", color: "#fff", fontWeight: 800 }}>
              WY
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Weld Yard · Digital Welding Management</div>
              <div className="text-base font-semibold leading-tight">{companyName ?? "Workspace"}</div>
              <div className="text-[10.5pt] font-bold mt-1">{title}</div>
            </div>
          </div>
          <div className="text-end text-[10px] leading-tight">
            <table className="text-[10px] border-collapse">
              <tbody>
                <Row label="Doc No." value={<span className="font-mono">{docNo}</span>} />
                <Row label="Revision" value={revision} />
                {status && <Row label="Status" value={status} />}
                <Row label="Issued" value={generated.toLocaleDateString()} />
                <Row label="Page" value="1 of 1" />
              </tbody>
            </table>
          </div>
        </header>

        {/* Optional meta strip */}
        {meta && meta.length > 0 && (
          <div className="grid grid-cols-4 gap-0 border border-foreground/70 mb-4 avoid-break">
            {meta.map((m, i) => (
              <div key={i} className="border-e border-b border-foreground/30 last:border-e-0 px-3 py-2 text-[11px]">
                <div className="uppercase tracking-wider text-[9px] text-muted-foreground">{m.label}</div>
                <div className="font-medium mt-0.5">{m.value ?? "—"}</div>
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <main className="space-y-4">{children}</main>

        {/* Signature block */}
        <section className="mt-8 avoid-break">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Approvals & Signatures</div>
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
                  <td key={i} className="align-top" style={{ height: 64 }}>
                    <div className="text-[10px] text-muted-foreground">Name</div>
                    <div className="font-medium min-h-[14pt]">{s.name ?? ""}</div>
                  </td>
                ))}
              </tr>
              <tr>
                {sigs.map((s, i) => (
                  <td key={i} className="align-top">
                    <div className="text-[10px] text-muted-foreground">Signature</div>
                    <div className="min-h-[28pt] border-b border-foreground/40" />
                    <div className="text-[10px] text-muted-foreground mt-1">Date: {s.date ?? "______________"}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {/* Footer with QR + traceability hash */}
        <footer className="mt-6 pt-3 border-t border-foreground/40 flex items-center justify-between gap-4 text-[9.5px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 border border-foreground/30 rounded">
              <QRCodeSVG value={verify} size={56} />
            </div>
            <div>
              <div className="font-semibold text-foreground">Scan to verify authenticity</div>
              <div className="break-all">{verify}</div>
              <div>Hash: <span className="font-mono">{shortHash(docNo + verify, 10)}</span></div>
            </div>
          </div>
          <div className="text-end">
            <div>Generated {generated.toLocaleString()}</div>
            <div>By {profile?.display_name || user?.email}</div>
            <div className="mt-0.5">Weld Yard · Audit-ready engineering document · {companyName ?? ""}</div>
            <div>Controlled copy when printed with signatures · Uncontrolled otherwise</div>
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

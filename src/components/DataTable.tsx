import { ReactNode, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  /** Field used for text search. */
  searchable?: (row: T) => string;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  loading,
  onRowClick,
  searchPlaceholder = "Search…",
  filters,
  empty = "No records yet.",
  initialSearch = "",
}: {
  rows: T[] | undefined;
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  empty?: ReactNode;
  initialSearch?: string;
}) {
  const [q, setQ] = useState(initialSearch);

  const visible = useMemo(() => {
    if (!rows) return [];
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    const searchers = columns.filter((c) => c.searchable).map((c) => c.searchable!);
    return rows.filter((r) =>
      searchers.some((s) => (s(r) ?? "").toLowerCase().includes(needle)),
    );
  }, [rows, q, columns]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="ps-9 h-9 bg-background/60"
          />
        </div>
        {filters}
        <div className="ms-auto text-xs text-muted-foreground">
          {loading ? "Loading…" : `${visible.length} of ${rows?.length ?? 0}`}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40 sticky top-0 z-[1]">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={cn("text-start font-medium px-5 py-3 whitespace-nowrap", c.className)}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin inline me-2" /> Loading…
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center text-sm text-muted-foreground">
                    <Inbox className="size-6 mx-auto mb-2 opacity-50" />
                    {empty}
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map((r) => (
                  <tr
                    key={r.id}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    className={cn(
                      "border-t border-border/60 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-muted/30",
                    )}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-5 py-3", c.className)}>
                        {c.cell(r)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

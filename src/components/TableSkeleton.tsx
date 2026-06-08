import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border/60">
          {Array.from({ length: cols }).map((__, j) => (
            <Skeleton
              key={j}
              className="h-4"
              style={{ width: `${[14, 22, 18, 14, 18, 12][j % 6]}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

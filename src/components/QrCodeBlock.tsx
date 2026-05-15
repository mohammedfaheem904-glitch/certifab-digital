import { QRCodeSVG } from "qrcode.react";

export function QrCodeBlock({
  value,
  size = 96,
  caption,
}: {
  value: string;
  size?: number;
  caption?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-1.5 rounded-md border border-border/60 bg-background p-2">
      <QRCodeSVG value={value} size={size} level="M" includeMargin={false} />
      {caption && (
        <span className="text-[10px] text-muted-foreground tracking-wide uppercase">
          {caption}
        </span>
      )}
    </div>
  );
}

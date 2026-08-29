// src/components/detail-item.tsx
import { cn } from "@/lib/utils";

export function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}
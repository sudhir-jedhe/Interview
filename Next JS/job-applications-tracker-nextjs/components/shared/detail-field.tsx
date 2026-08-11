import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function DetailField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase">
        <Icon className="size-3" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 text-sm break-words text-foreground">{children}</dd>
    </div>
  );
}

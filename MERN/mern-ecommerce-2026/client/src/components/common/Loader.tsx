import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const wrapClass = "flex min-h-screen w-full items-center justify-center";

const contentClass =
  "flex flex-col items-center gap-3 text-sm text-muted-foreground";

const iconClass = "h-8 w-8 animate-spin text-primary";

type CommonLoaderProps = {
  text?: string;
  className?: string;
  iconClassName?: string;
};

export function Commonloader({
  text = "Loading...",
  className,
  iconClassName,
}: CommonLoaderProps) {
  return (
    <div className={cn(wrapClass, className)}>
      <div className={contentClass}>
        <Loader2 className={cn(iconClass, iconClassName)} />
        <p>{text}</p>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AccountMenu() {
  const { data: session } = useSession();

  if (!session) return null;
  const { user } = session;

  return (
    <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
      <Avatar size="sm">
        <AvatarImage src={user.image ?? undefined} alt={user.name} />
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {user.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </span>
    </div>
  );
}

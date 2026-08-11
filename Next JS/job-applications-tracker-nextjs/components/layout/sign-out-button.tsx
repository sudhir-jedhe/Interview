"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSignOut}
      className={cn(
        "w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      <LogOut className="size-4" aria-hidden />
      Sign out
    </Button>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { signIn } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";

type Provider = "google" | "github" | "demo";

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<Provider | null>(null);

  const callbackURL = safeRedirect(searchParams.get("redirect"));

  async function withSocial(provider: "google" | "github") {
    setPending(provider);
    try {
      await signIn.social({ provider, callbackURL });
    } catch {
      toast.error("Could not start sign-in. Please try again.");
      setPending(null);
    }
  }

  async function tryDemo() {
    setPending("demo");
    const { error } = await signIn.email({
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL!,
      password: process.env.NEXT_PUBLIC_DEMO_PASSWORD!,
    });
    if (error) {
      toast.error("The demo account isn't set up on this deployment.");
      setPending(null);
      return;
    }
    router.push(callbackURL);
  }

  return { pending, withSocial, tryDemo };
}

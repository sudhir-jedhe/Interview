"use client";

import Link from "next/link";

import { Reveal } from "@/components/landing/landing-sections";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GithubIcon, GoogleIcon } from "@/components/login/provider-icons";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/hooks/use-login-form";

export function LoginForm() {
  const { pending, withSocial, tryDemo } = useLoginForm();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Grid and radial wash, matching the landing page hero. */}
      <div
        aria-hidden
        className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
      />

      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      <Reveal className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card px-6 py-8 shadow-lift sm:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your job application tracker
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center gap-3 font-medium"
              disabled={pending !== null}
              onClick={() => withSocial("google")}
            >
              <GoogleIcon />
              {pending === "google" ? "Connecting…" : "Continue with Google"}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center gap-3 font-medium"
              disabled={pending !== null}
              onClick={() => withSocial("github")}
            >
              <GithubIcon />
              {pending === "github" ? "Connecting…" : "Continue with GitHub"}
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="ghost"
            size="lg"
            className="underline w-full justify-center font-medium text-muted-foreground cursor-pointer"
            disabled={pending !== null}
            onClick={tryDemo}
          >
            {pending === "demo" ? "Loading demo…" : "Try Demo Account"}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          HireLoop keeps every user&rsquo;s applications private. New
          Google/GitHub sign-ins start with an empty tracker.
        </p>
      </Reveal>
    </div>
  );
}

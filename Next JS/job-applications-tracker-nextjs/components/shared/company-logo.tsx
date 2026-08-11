"use client";

import { useState } from "react";

import { companyAccent, companyLogoUrl } from "@/lib/company";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-7 rounded-md text-[0.625rem]",
  md: "size-9 rounded-lg text-xs",
  lg: "size-12 rounded-xl text-sm",
  xl: "size-16 rounded-2xl text-lg",
} as const;

type CompanyLogoProps = {
  companyName: string;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Shows a fetched brand mark when we can resolve one, and falls back to tinted
 * initials otherwise. The fallback is also used when the remote image 404s, so
 * a broken CDN never leaves an empty square.
 */
export function CompanyLogo({
  companyName,
  size = "md",
  className,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = companyLogoUrl(companyName);

  const shell = cn(
    "flex shrink-0 items-center justify-center overflow-hidden border border-border/70 font-semibold select-none",
    SIZES[size],
    className,
  );

  if (!src || failed) {
    return (
      <div
        className={cn(shell, companyAccent(companyName))}
        aria-hidden
        title={companyName}
      >
        {initials(companyName)}
      </div>
    );
  }

  return (
    <div className={cn(shell, "bg-white")} title={companyName}>
      {/* Plain <img>: these are tiny third-party marks, and routing them
          through the optimizer buys nothing but a cold-start penalty. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-full object-contain p-1"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

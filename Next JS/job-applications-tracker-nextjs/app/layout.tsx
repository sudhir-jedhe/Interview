import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_DESCRIPTION, APP_NAME } from "@/constants";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://hireloop.yogeshchavan.dev";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — The Most Advanced Job Application Tracker`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  metadataBase: new URL(baseUrl),
  keywords: [
    "job application tracker",
    "job search tracker",
    "interview tracker",
    "job hunt organizer",
    "application pipeline",
    "job search kanban board",
    "job offer tracker",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} — The Most Advanced Job Application Tracker`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — The Most Advanced Job Application Tracker`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — The Most Advanced Job Application Tracker`,
    description: APP_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full min-w-0 flex-col antialiased">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="6b5d299c-6ac2-4b96-be5c-15b1430cd471"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

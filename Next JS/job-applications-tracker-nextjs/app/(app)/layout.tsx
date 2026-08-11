import { CommandPalette } from "@/components/layout/command-palette-loader";
import { KeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background lg:pl-[16.5rem]">
      <Sidebar />

      <div className="flex min-h-dvh min-w-0 flex-col">
        <Topbar />
        {/* Bottom padding clears the mobile tab bar. */}
        <main className="min-w-0 flex-1 px-3 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))] min-[380px]:px-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-12">
          <div className="mx-auto w-full max-w-[86rem] min-w-0">{children}</div>
        </main>
      </div>

      <MobileNav />
      <CommandPalette />
      <KeyboardShortcuts />
    </div>
  );
}

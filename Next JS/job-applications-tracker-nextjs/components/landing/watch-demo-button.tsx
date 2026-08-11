"use client";

import { Play } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DEMO_VIDEO_URL =
  "https://res.cloudinary.com/dyatqxvue/video/upload/v1784961264/Videos/giz19l8po4govjfgiex9.mp4";

export function WatchDemoButton() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer bg-primary text-white group relative inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border px-6 text-sm font-medium text-foreground shadow-xs transition-colors before:absolute before:inset-0 before:rounded-[inherit] before:bg-accent/40 before:opacity-0 before:content-[''] hover:bg-accent hover:text-accent-foreground hover:before:animate-ping hover:before:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-auto"
        >
          <span className="relative flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75" />
            <Play
              className="relative size-3 fill-current text-white"
              aria-hidden
            />
          </span>
          Watch Demo
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="max-w-4xl overflow-hidden border-0 p-0 sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">Watch Demo</DialogTitle>
        <div className="aspect-video w-full bg-black">
          {demoOpen && (
            <video
              src={DEMO_VIDEO_URL}
              controls
              autoPlay
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

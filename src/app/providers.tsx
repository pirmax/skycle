"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "nextjs-google-analytics";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainProvider } from "@/providers/main-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MainProvider>
      <VercelAnalytics />
      <GoogleAnalytics trackPageViews />
      <TooltipProvider>{children}</TooltipProvider>
    </MainProvider>
  );
}

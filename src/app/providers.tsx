"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import dynamic from "next/dynamic";
import { GoogleAnalytics } from "nextjs-google-analytics";
import type { ComponentType, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainProvider } from "@/providers/main-provider";

const CookieConsent: ComponentType = dynamic(
  () => import("@/components/cookie-consent"),
  {
    ssr: false,
  },
);

function Providers({ children }: { children: ReactNode }) {
  return (
    <MainProvider>
      <VercelAnalytics />
      <GoogleAnalytics trackPageViews />
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
      <CookieConsent />
    </MainProvider>
  );
}

export default Providers;

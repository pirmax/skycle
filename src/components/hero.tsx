"use client";

import { type JSX, useId } from "react";
import { AppDemo } from "@/components/app-demo";
import { Container } from "@/components/container";
import { PhoneFrame } from "@/components/phone-frame";
import { SearchUser } from "@/components/search-user";
import type { VersionDefinition } from "@/types";

type BackgroundIllustrationProps = React.SVGProps<SVGSVGElement>;

function BackgroundIllustration({
  ...props
}: BackgroundIllustrationProps): JSX.Element {
  const id: string = useId();

  return (
    <>
      <svg
        role="img"
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        aria-label="Background illustration"
        className="absolute inset-0 h-full w-full animate-spin-slow"
        {...props}
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ddd711" />
            <stop offset="1" stopColor="#ddd711" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-reverse-slower"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ddd711" />
            <stop offset="1" stopColor="#ddd711" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

type HeroProps = {
  data: VersionDefinition;
};

export function Hero({ data }: HeroProps) {
  return (
    <div className="mt-20 overflow-hidden pb-20 sm:py-32 lg:mt-0 lg:pb-32 xl:pb-36">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-5 text-center lg:col-span-7 lg:max-w-none lg:pt-6 lg:text-left xl:col-span-6">
            <h2 className="font-bold text-2xl text-muted-foreground uppercase tracking-tight">
              Skycle &mdash; The real honeycomb
            </h2>
            <h1 className="inline-block text-balance bg-linear-to-br from-yellow-500 via-yellow-600 to-yellow-300 bg-clip-text font-black text-5xl text-transparent tracking-tight drop-shadow-lg md:text-7xl">
              Who are your best interactions on Bluesky ?
            </h1>
            <p className="text-balance font-medium text-foreground text-xl leading-6">
              Skycle instantly generates a beautiful, shareable image that shows
              the people you interact with the most on Bluesky. No sign-up, no
              hassle — just you and your circle.
            </p>
            <div className="w-full">
              <SearchUser />
            </div>
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <BackgroundIllustration className="absolute top-4 left-1/2 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0" />
            <div className="-mx-4 h-[448px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-10 lg:-bottom-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
              <PhoneFrame className="mx-auto max-w-[366px]" priority>
                <AppDemo data={data} />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

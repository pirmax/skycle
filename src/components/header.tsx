"use client";

import { IconBrandBluesky, IconBrandPaypal } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between pt-8 border-b">
          <div className="relative z-10 gap-16">
            <Link href={`/`} className="flex items-center">
              <Image
                src="/logo.gif"
                alt="Skycle"
                className="size-32 -mb-5"
                width="480"
                height="480"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <Link href="https://paypal.me/pirmax" target="_blank">
              <Button variant="outline">
                <IconBrandPaypal className="size-4 sm:mr-2" />
                <span className="hidden sm:inline-block">Support Me</span>
              </Button>
            </Link>
            <Link href="https://bsky.app/profile/skycle.app" target="_blank">
              <Button variant="default">
                <IconBrandBluesky className="size-4 sm:mr-2" />
                <span className="hidden sm:inline-block">
                  Follow Skycle on Bluesky
                </span>
              </Button>
            </Link>
          </div>
        </Container>
      </nav>
    </header>
  );
}

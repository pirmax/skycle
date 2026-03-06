"use client";

import Link from "next/link";
import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="border-gray-200 border-t">
      <Container className="py-10">
        <div className="mt-5 flex flex-col items-center md:flex-row md:justify-between">
          <p className="text-gray-500 text-sm">
            &copy; Copyright {new Date().getFullYear()} Skycle. All Rights
            Reserved.
          </p>
          <ul className="flex items-center space-x-2 text-gray-500 text-sm md:mt-0">
            <li>
              <Link href={`https://paypal.me/pirmax`} target="_blank">
                Support Me
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/tos`} target="_self">
                Terms of Service
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/privacy`} target="_self">
                Privacy Policy
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/cookies`} target="_self">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

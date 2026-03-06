import { IconHome } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate min-h-full">
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <h1 className="mt-4 font-bold text-3xl text-gray-900 tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-gray-900/70 sm:mt-6">
          Sorry, we could not find the page you are looking for.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="flex items-center space-x-1 font-semibold text-gray-900 text-sm leading-7"
          >
            <IconHome />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

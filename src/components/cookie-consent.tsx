"use client";

import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [value, setValue] = useLocalStorage<"accepted" | "rejected" | null>(
    "cookie-consent",
    null,
  );

  const handleAccept = (): void => {
    setValue("accepted");
  };

  const handleReject = (): void => {
    setValue("rejected");
  };

  if (value) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-6 pb-6">
      <div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
        <p className="text-gray-900 text-sm leading-6">
          This website uses cookies to supplement a balanced diet and provide a
          much-deserved reward to the senses after consuming bland but
          nutritious meals. Accepting our cookies is optional but recommended,
          as they are delicious. For more details on how we handle your data and
          respect your privacy. By continuing to use our site, you agree with
          our{" "}
          <Link href={`/cookies`} className="font-semibold text-indigo-600">
            Cookie Policy
          </Link>
          ,{" "}
          <Link href={`/privacy`} className="font-semibold text-indigo-600">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href={`/tos`} className="font-semibold text-indigo-600">
            Terms of Service
          </Link>
          .
        </p>
        <div className="mt-4 flex items-center gap-x-1">
          <Button variant="default" type="button" onClick={handleAccept}>
            Accept all
          </Button>
          <Button variant="ghost" type="button" onClick={handleReject}>
            Reject all
          </Button>
        </div>
      </div>
    </div>
  );
}

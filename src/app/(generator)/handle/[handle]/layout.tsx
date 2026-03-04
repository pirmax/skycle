import type { JSX } from "react";
import { getVersionsByHandle } from "@/actions";
import { Shell } from "@/components/shell";
import type { Version } from "@/generated/prisma/client";
import getSession, { type User } from "@/lib/iron";

export default async function Layout({
  params: { handle },
  children,
}: {
  params: {
    handle: string;
  };
  children: JSX.Element;
}): Promise<JSX.Element> {
  const session: {
    user: User | null;
  } = await getSession();

  const versions: Version[] = await getVersionsByHandle(handle);

  if (session.user?.handle !== handle) {
    return (
      <Shell user={null} versions={versions}>
        {children}
      </Shell>
    );
  }

  return (
    <Shell user={session.user} versions={versions}>
      {children}
    </Shell>
  );
}

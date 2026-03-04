import { Agent } from "@atproto/api";
import type { IronSession } from "iron-session";
import { type NextRequest, NextResponse } from "next/server";
import createBlueskyClient from "@/lib/atproto";
import getSession, { type User } from "@/lib/iron";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const blueskyClient = await createBlueskyClient(prisma);

    const { session } = await blueskyClient.callback(
      request.nextUrl.searchParams,
    );

    const agent = new Agent(session);

    const { data } = await agent.getProfile({
      actor: session.did,
    });

    const ironSession: IronSession<{
      user: User | null;
    }> = await getSession();

    ironSession.user = {
      did: session.did,
      handle: data.handle,
      avatar: data.avatar || null,
    };

    await ironSession.save();

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/@${data.handle}?upload`,
    );
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}?error=${e.message}`,
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}?error=An error occurred!`,
      );
    }
  }
}

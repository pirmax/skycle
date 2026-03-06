import { NextResponse } from "next/server";
import createBlueskyClient from "@/lib/atproto";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const blueskyClient = await createBlueskyClient(prisma);

  return NextResponse.json(blueskyClient.clientMetadata, {
    status: 200,
  });
}

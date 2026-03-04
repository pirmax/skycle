"use server";

import { Agent, RichText } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client";
import type { Version } from "@/generated/prisma/client";
import createBlueskyClient from "@/lib/atproto";
import getSession from "@/lib/iron";
import { prisma } from "@/lib/prisma";
import type { ProfileDefinition, UnsplashResult } from "@/types";
import Cache from "@/utils/cache";
import { compressToUnder1MB } from "@/utils/functions";

export const loginToBluesky = async (handle: string): Promise<string> => {
  const blueskyClient = await createBlueskyClient(prisma);
  const url: URL = await blueskyClient.authorize(handle);

  return url.toString();
};

export const destroyTheSession = async (): Promise<void> => {
  const session = await getSession();
  session.destroy();
};

export const getVersionsByHandle = async (handle: string): Promise<Version[]> => {
  return prisma.version.findMany({
    where: {
      ownerHandle: handle as string,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
};

export const searchBackground = async (query: string): Promise<UnsplashResult[]> => {
  const key = `search-background-${query.toLowerCase()}`;
  const redisCache = await Cache.getCache(key);

  if (redisCache) {
    return redisCache as unknown as UnsplashResult[];
  }

  const response: Response = await fetch(
    `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${query}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  await Cache.setCache(key, data.results, 60 * 60 * 24 * 7);

  return data.results as unknown as UnsplashResult[];
};

export const uploadOnBluesky = async (formData: FormData): Promise<string> => {
  const session = await getSession();

  if (!session) {
    throw new Error("Session not found");
  }

  if (!session.user) {
    throw new Error("User not found");
  }

  const blueskyClient = await createBlueskyClient(prisma);
  const oauthSession: OAuthSession = await blueskyClient.restore(session.user.did, true);
  const agent = new Agent(oauthSession);

  const file: File | null = formData.get("image") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const arrayBuffer = await file.arrayBuffer();
  const data = await compressToUnder1MB(arrayBuffer);

  const uploadData = await agent.uploadBlob(data, {
    encoding: file.type,
  });

  const richText: RichText = new RichText({
    text: formData.get("message") as string,
  });

  await richText.detectFacets(agent);

  const response: {
    uri: string;
    cid: string;
  } = await agent.post({
    $type: "app.bsky.feed.post",
    text: richText.text,
    facets: richText.facets,
    embed: {
      $type: "app.bsky.embed.images",
      images: [
        {
          image: uploadData.data.blob,
          alt: "Skycle circles with avatars, crafted by @skycle.app",
        },
      ],
    },
  });

  const revision = response.uri.split("/").pop();

  return `https://bsky.app/profile/${session.user.handle}/post/${revision}`;
};

export const saveVersion = async (
  ownerDid: string,
  ownerHandle: string,
  circles: {
    own: ProfileDefinition;
    friends: ProfileDefinition[];
  },
): Promise<void> => {
  await prisma.version.create({
    data: {
      ownerDid,
      ownerHandle,
      generatedData: JSON.stringify(circles),
    },
  });
};

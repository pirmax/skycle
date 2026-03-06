import { AtpAgent } from "@atproto/api";
import type { AtpSessionData } from "@atproto/api/src/types";
import Cache from "@/utils/cache";

const key = "session-main";

const agent: AtpAgent = new AtpAgent({
  service: "https://bsky.social",
});

export const getBlueskySession = async (): Promise<AtpSessionData> => {
  const cache = (await Cache.getCache(key)) as AtpSessionData | null;

  if (!cache) {
    const { data } = await agent.login({
      identifier: process.env.BSKY_ACCOUNT_HANDLE as string,
      password: process.env.BSKY_ACCOUNT_PASSWORD as string,
    });

    await Cache.setCache(key, data, 60 * 20);

    return data as AtpSessionData;
  }

  return cache;
};

export default agent;

"use server";

import {
  type AppBskyActorDefs,
  AppBskyEmbedRecord,
  AppBskyFeedDefs,
  AppBskyRichtextFacet,
  type AtpSessionData,
  type Facet,
  RichText,
  type RichTextSegment,
} from "@atproto/api";
import {
  endOfDay,
  parseISO,
  startOfDay,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import {
  chunk,
  countBy,
  filter,
  orderBy,
  remove,
  some,
  uniq,
  uniqBy,
} from "lodash";
import { saveVersion } from "@/actions/index";
import type { ProfileDefinition, VersionDefinition } from "@/types";
import agent, { getBlueskySession } from "@/utils/agent";
import Cache from "@/utils/cache";
import { HANDLE_REGEX, MAX_SKEETS_ITERATIONS, SCORES } from "@/utils/constants";
import { extractProfileInfo } from "@/utils/extract-profile-info";

export const fetchHandle: (
  handle: string,
  period: string | null,
) => Promise<VersionDefinition> = async (
  handle: string,
  period: string | null,
): Promise<VersionDefinition> => {
  // Check cache
  const inCache = await Cache.getCache(`handle-${handle}-${period}`);

  if (inCache) {
    // Return cached version
    return JSON.parse(inCache) as VersionDefinition;
  }

  // Resume session
  const session: AtpSessionData = await getBlueskySession();
  await agent.resumeSession(session);

  // Fetch user profile
  const profileFetched = await agent.getProfile({
    actor: handle,
  });

  // Skycle follow the user
  await agent.follow(profileFetched.data.did);

  // Extract own profile information
  const own: ProfileDefinition = extractProfileInfo(profileFetched.data);

  let usersData: ProfileDefinition[] = [];

  // Fetch user skeets
  const skeets: AppBskyFeedDefs.FeedViewPost[] = await fetchTweets(own.did);

  // Get time range
  const range = await getPeriod(period);

  // Filter skeets by time range
  const filteredSkeets: AppBskyFeedDefs.FeedViewPost[] = skeets.filter(
    (skeet: AppBskyFeedDefs.FeedViewPost): boolean => {
      const createdAt: Date = parseISO(
        (skeet.post.record as { createdAt: string }).createdAt,
      );
      const isInRange: boolean =
        createdAt >= range.start && createdAt <= range.end;

      return isInRange;
    },
  );

  // Find mentions
  const mentions: AppBskyFeedDefs.FeedViewPost[] = filteredSkeets.filter(
    (skeet: AppBskyFeedDefs.FeedViewPost): boolean =>
      some(
        (skeet.post.record as { facets: Facet[] }).facets,
        (facet: Facet): boolean =>
          AppBskyRichtextFacet.isMention(facet.features[0]) &&
          facet.features[0].did !== own.did,
      ),
  );

  // Extract mentioned user handles
  const mentionUserHandles: string[] = mentions.flatMap(
    (mention: AppBskyFeedDefs.FeedViewPost): string[] => {
      const mentions: string[] = [];

      const richText = new RichText({
        text: (mention?.post?.record as { text: string })?.text,
        facets: (mention?.post?.record as { facets: Facet[] })?.facets,
      });

      for (const segment of richText.segments() as unknown as RichTextSegment[]) {
        if (segment.isMention()) {
          const handle: string = segment?.text.replace("@", "");

          if (HANDLE_REGEX.exec(handle)) {
            mentions.push(segment?.text.replace("@", ""));
          }
        }
      }

      return mentions;
    },
  );

  // Count mentioned user DIDs
  const mentionedUserDids: {
    [key: string]: number;
  } = countBy(
    mentions.map((skeet: AppBskyFeedDefs.FeedViewPost): string[] =>
      (skeet.post.record as { facets: Facet[] }).facets.map(
        (facet: Facet): string =>
          AppBskyRichtextFacet.isMention(facet.features[0])
            ? facet.features[0].did
            : "",
      ),
    ),
  );

  // Find shares
  const shares: AppBskyFeedDefs.FeedViewPost[] = filteredSkeets.filter(
    (skeet: AppBskyFeedDefs.FeedViewPost): boolean =>
      AppBskyFeedDefs.isReasonRepost(skeet.reason) &&
      skeet?.reason?.by?.did === own.did &&
      skeet?.post?.author?.did !== own.did,
  );

  // Count shares
  const sharesUserDids: {
    [key: string]: number;
  } = countBy(
    shares.map(
      (reskeet: AppBskyFeedDefs.FeedViewPost): string =>
        reskeet.post.author.did,
    ),
  );

  usersData = usersData.concat(
    shares.map(
      (share: AppBskyFeedDefs.FeedViewPost): ProfileDefinition =>
        extractProfileInfo(share?.post?.author),
    ),
  );

  // Find quotes
  const quotes: AppBskyFeedDefs.FeedViewPost[] = filteredSkeets.filter(
    (skeet: AppBskyFeedDefs.FeedViewPost): boolean =>
      AppBskyEmbedRecord.isView(skeet?.post?.embed) &&
      AppBskyEmbedRecord.isViewRecord(skeet?.post?.embed?.record) &&
      skeet?.post?.embed?.record?.author.did !== own.did,
  );

  // Count quotes
  const quotesUserDids: {
    [key: string]: number;
  } = countBy(
    quotes.map((skeet: AppBskyFeedDefs.FeedViewPost): string =>
      AppBskyEmbedRecord.isView(skeet?.post?.embed) &&
      AppBskyEmbedRecord.isViewRecord(skeet?.post?.embed?.record)
        ? skeet?.post?.embed?.record?.author.did
        : "",
    ),
  );

  // Extract quote author profiles
  usersData = usersData.concat(
    quotes.map(
      (skeet: AppBskyFeedDefs.FeedViewPost): ProfileDefinition =>
        AppBskyEmbedRecord.isView(skeet?.post?.embed) &&
        AppBskyEmbedRecord.isViewRecord(skeet?.post?.embed?.record)
          ? extractProfileInfo(skeet?.post?.embed?.record?.author)
          : extractProfileInfo(skeet?.post?.author),
    ),
  );

  // Find replies
  const replies: AppBskyFeedDefs.FeedViewPost[] = filteredSkeets.filter(
    (skeet: AppBskyFeedDefs.FeedViewPost): boolean =>
      AppBskyFeedDefs.isPostView(skeet?.reply?.root) &&
      skeet?.reply?.root?.author.did !== own.did,
  );

  // Count replies
  const repliesUserDids: {
    [key: string]: number;
  } = countBy(
    replies.map(
      (skeet: AppBskyFeedDefs.FeedViewPost): string =>
        (
          skeet?.reply?.root as {
            author: AppBskyActorDefs.ProfileViewDetailed;
          }
        )?.author.did,
    ),
  );

  // Extract reply author profiles
  usersData = usersData.concat(
    replies.map(
      (skeet: AppBskyFeedDefs.FeedViewPost): ProfileDefinition =>
        extractProfileInfo(
          (
            skeet?.reply?.root as {
              author: AppBskyActorDefs.ProfileViewDetailed;
            }
          )?.author,
        ),
    ),
  );

  // Fetch mentioned user profiles
  const mentionedUsers: ProfileDefinition[] =
    await fetchMentionedUsers(mentionUserHandles);

  // Extract mentioned user profiles
  usersData = usersData.concat(mentionedUsers);

  // Remove duplicates
  const uniqueUsers: ProfileDefinition[] = uniqBy(usersData, "did");

  // Map friends with scores
  const friendsWithScores: ProfileDefinition[] = uniqueUsers.map(
    (user: ProfileDefinition): ProfileDefinition => {
      const { did } = user;

      const mentions: number = mentionedUserDids[did] || 0;
      const quotes: number = quotesUserDids[did] || 0;
      const shares: number = sharesUserDids[did] || 0;
      const replies: number = repliesUserDids[did] || 0;

      const score: number =
        SCORES.base + // point de base
        SCORES.perReplies * replies + // réponses = engagement direct + effort
        SCORES.perMentions * mentions + // mentions = reconnaissance directe
        SCORES.perQuotes * quotes + // citations = valorisation + redistribution
        SCORES.perShares * shares; // partages = diffusion (mais parfois passif)

      return {
        ...user,
        score,
        interactions: {
          replies,
          mentions,
          quotes,
          shares,
        },
      };
    },
  );

  // Sort friends by score
  const friends: ProfileDefinition[] = orderBy(
    filter(friendsWithScores),
    "score",
    ["desc"],
  );
  remove(
    friends,
    (friend: ProfileDefinition): boolean => friend.did === own.did,
  );
  remove(
    friends,
    (friend: ProfileDefinition): boolean => friend.handle === "handle.invalid",
  );

  const circles: VersionDefinition = {
    own,
    friends,
  };

  // Save version and cache
  await saveVersion(own.did, own.handle, circles);
  await Cache.setCache(
    `handle-${handle}-${period}`,
    JSON.stringify(circles),
    60 * 60 * 24,
  );

  return circles;
};

export const getPeriod = async (
  period: string | null,
): Promise<{
  start: Date;
  end: Date;
}> => {
  const now = new Date();

  switch (period) {
    case "last-six-months":
      return {
        start: startOfDay(subMonths(now, 6)),
        end: endOfDay(now),
      };
    case "last-month":
      return {
        start: startOfDay(subMonths(now, 1)),
        end: endOfDay(now),
      };
    case "today":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case "seven-days":
      return {
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now),
      };
    default:
      return {
        start: startOfDay(subYears(now, 1)),
        end: endOfDay(now),
      };
  }
};

const fetchTweets: (did: string) => Promise<AppBskyFeedDefs.FeedViewPost[]> =
  async (did: string): Promise<AppBskyFeedDefs.FeedViewPost[]> => {
    let skeets: AppBskyFeedDefs.FeedViewPost[] = [];
    let cursor: string | undefined;

    for (let i = 0; i < MAX_SKEETS_ITERATIONS; i++) {
      const { data } = await agent.getAuthorFeed({
        actor: did,
        cursor: cursor,
        filter: "posts_with_replies",
        limit: 100,
      });

      skeets = skeets.concat(data.feed);

      if (!data.cursor) {
        break;
      }

      cursor = data.cursor;
    }

    return skeets;
  };

const fetchMentionedUsers: (
  mentionUserHandles: string[],
) => Promise<ProfileDefinition[]> = async (
  mentionUserHandles: string[],
): Promise<ProfileDefinition[]> => {
  const handles: string[][] = chunk(uniq(mentionUserHandles), 25);

  const requests: Promise<ProfileDefinition[]>[] = handles.map(
    async (actors: string[]): Promise<ProfileDefinition[]> => {
      try {
        const { data } = await agent.getProfiles({
          actors,
        });

        return data.profiles.map(extractProfileInfo);
      } catch (_: unknown) {
        return [];
      }
    },
  );

  const batchedResults: ProfileDefinition[][] = await Promise.all(requests);

  return batchedResults.reduce(
    (
      combined: ProfileDefinition[],
      handle: ProfileDefinition[],
    ): ProfileDefinition[] => combined.concat(handle),
    [],
  );
};

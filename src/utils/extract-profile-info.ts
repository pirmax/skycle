import type { AppBskyActorDefs } from "@atproto/api";
import type { ProfileDefinition } from "@/types";
import { DEFAULT_AVATAR } from "@/utils/constants";

export const extractProfileInfo = (
  user:
    | AppBskyActorDefs.ProfileViewDetailed
    | AppBskyActorDefs.ProfileViewBasic,
): ProfileDefinition => {
  return {
    did: user.did,
    avatar: user?.avatar || DEFAULT_AVATAR,
    displayName: user.displayName || "",
    handle: user.handle,
    url: `https://bsky.app/profile/${user.handle}`,
    score: 0,
    verified:
      typeof user.verification === "object" &&
      user.verification !== null &&
      "verifiedStatus" in user.verification &&
      (user.verification as { verifiedStatus?: string }).verifiedStatus ===
        "valid",
  };
};

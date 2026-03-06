import { useAtom } from "jotai/index";
import type { ProfileDefinition } from "@/types";
import { distributeItems } from "@/utils/distribute-items";
import { circlesDefinitionAtom, hiddenFriendsAtom } from "@/utils/maker-atom";

export const useItemDistribution = (
  friends: ProfileDefinition[],
): ProfileDefinition[][] => {
  const [circlesDefinition] = useAtom(circlesDefinitionAtom);
  const [hiddenFriends] = useAtom(hiddenFriendsAtom);

  const visibleFriends: ProfileDefinition[] = friends.filter(
    (friend: ProfileDefinition) => {
      return !hiddenFriends.includes(friend.did);
    },
  );

  return distributeItems(visibleFriends, circlesDefinition);
};

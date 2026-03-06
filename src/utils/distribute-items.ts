import type { CircleDefinition, ProfileDefinition } from "@/types";

export const distributeItems = (
  friends: ProfileDefinition[],
  circlesDefinition: CircleDefinition[],
): ProfileDefinition[][] => {
  const distribution: ProfileDefinition[][] = [];
  let remainingItems: ProfileDefinition[] = [...friends];

  circlesDefinition.forEach((circleDefinition: CircleDefinition): void => {
    const circleItems: ProfileDefinition[] = remainingItems.slice(
      0,
      circleDefinition.numberOfItems,
    );

    distribution.push(circleItems);

    remainingItems = remainingItems.slice(circleDefinition.numberOfItems);
  });

  return distribution;
};

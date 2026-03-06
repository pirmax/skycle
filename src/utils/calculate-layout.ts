import type { CircleDefinition, LayoutDefinition } from "@/types";
import {
  AVAILABLE_SPACE,
  CENTER_RADIUS,
  CIRCLE_SPACING,
} from "@/utils/constants";

export const calculateLayout = (
  circles: CircleDefinition[],
): LayoutDefinition[] => {
  const numberOfCircles: number = circles.length;
  const maxItemRadius: number =
    (AVAILABLE_SPACE / numberOfCircles - CIRCLE_SPACING) / 2;

  return circles.map(
    (circle: CircleDefinition, index: number): LayoutDefinition => {
      const circleIndex: number = index + 1;
      const positionSpacing: number = 360 / circle.numberOfItems;
      const itemPositions: number[] = [];

      for (let p: number = 0; p < 360; p += positionSpacing) {
        itemPositions.push(p - 90);
      }

      const radius: number =
        CENTER_RADIUS +
        circleIndex * CIRCLE_SPACING +
        (2 * circleIndex - 1) * maxItemRadius;

      const circumference: number = Math.PI * radius * 2 * 0.9;
      const itemRadius: number = Math.min(
        maxItemRadius,
        circumference / circle.numberOfItems / 2,
      );

      return {
        radius,
        itemRadius,
        itemPositions,
      } as LayoutDefinition;
    },
  );
};

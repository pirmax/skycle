import { CANVAS_PADDING, CANVAS_SIZE } from "@/utils/constants";
import { degreeToRadius } from "@/utils/degree-to-radius";

export type PointCoordinate = {
  x: number;
  y: number;
};

export const getCoordinates = (
  position: number,
  radius: number,
): PointCoordinate => {
  return {
    x:
      radius * Math.cos(degreeToRadius(position)) +
      (CANVAS_SIZE + CANVAS_PADDING) / 2,
    y:
      radius * Math.sin(degreeToRadius(position)) +
      (CANVAS_SIZE + CANVAS_PADDING) / 2,
  };
};

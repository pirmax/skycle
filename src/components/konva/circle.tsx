import { useAtom } from "jotai/index";
import { Fragment } from "react";
import { Circle as KonvaCircle } from "react-konva";
import { ImageCircle } from "@/components/konva/image-circle";
import { VerifiedCheck } from "@/components/konva/verified-check";
import type {
  GroupOfProfilesDefinition,
  LayoutDefinition,
  ProfileDefinition,
} from "@/types";
import { CANVAS_PADDING, CANVAS_SIZE } from "@/utils/constants";
import { getCoordinates, type PointCoordinate } from "@/utils/get-coordinates";
import { coloursAtom, hideFriendAtom, verifiedAtom } from "@/utils/maker-atom";

export function Circle({
  layout,
  items,
  interactive = false,
}: {
  layout: LayoutDefinition;
  items: GroupOfProfilesDefinition;
  interactive: boolean;
}) {
  const { radius, itemRadius, itemPositions } = layout;

  const [, hideFriend] = useAtom(hideFriendAtom);
  const [colours] = useAtom(coloursAtom);
  const [verified] = useAtom(verifiedAtom);

  return (
    <>
      <KonvaCircle
        radius={radius}
        x={(CANVAS_SIZE + CANVAS_PADDING) / 2}
        y={(CANVAS_SIZE + CANVAS_PADDING) / 2}
        stroke={colours.connectingLines}
        strokeWidth={1}
        listening={false}
      />

      {items.map((item: ProfileDefinition, index: number) => {
        const { x, y }: PointCoordinate = getCoordinates(
          itemPositions[index],
          radius,
        );

        return (
          <Fragment key={item.did}>
            <ImageCircle
              label={item.handle}
              source={item.avatar}
              x={x}
              y={y}
              radius={itemRadius}
              stroke={colours.circleBorders}
              strokeWidth={1}
              onClick={() => hideFriend(item.did)}
              onTap={() => hideFriend(item.did)}
              interactive={interactive}
            />
            {item.verified && verified && (
              <VerifiedCheck x={x} y={y} radius={itemRadius} />
            )}
          </Fragment>
        );
      })}
    </>
  );
}

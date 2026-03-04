import { useAtom } from "jotai/index";
import type { Layer } from "konva/lib/Layer";
import type { Stage } from "konva/lib/Stage";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Group as KonvaGroup, Layer as KonvaLayer, Stage as KonvaStage } from "react-konva";
import { Circle } from "@/components/konva/circle";
import { ImageCircle } from "@/components/konva/image-circle";
import { MainProviderContext } from "@/providers/main-provider";
import type {
  GroupOfCirclesDefinition,
  GroupOfLayoutsDefinition,
  LayoutDefinition,
  OwnerProfileDefinition,
} from "@/types";
import { calculateLayout } from "@/utils/calculate-layout";
import { CANVAS_PADDING, CANVAS_SIZE, CENTER_RADIUS } from "@/utils/constants";
import { circlesDefinitionAtom, coloursAtom, friendsAtom } from "@/utils/maker-atom";

type KonvaProps = {
  index: number;
  owner: OwnerProfileDefinition;
  circles: GroupOfCirclesDefinition;
};

type PositionX = number;
type PositionY = number;
type Width = number;
type Height = number;
type Scale = number;

type Size = {
  width: Width;
  height: Height;
};

type Position = {
  x: PositionX;
  y: PositionY;
};

export default function KonvaVersion({ index = 0, owner, circles }: KonvaProps) {
  const mainProvider = useContext(MainProviderContext);

  const divRef = useRef<HTMLDivElement>(null);

  const [, setFriends] = useAtom(friendsAtom);
  const [circlesDefinition] = useAtom(circlesDefinitionAtom);
  const [colours] = useAtom(coloursAtom);

  useEffect((): void => {
    setFriends(circles);
  }, [circles, setFriends]);

  useEffect((): void => {
    setSize({
      width: divRef.current?.offsetWidth || 0,
      height: divRef.current?.offsetHeight || 0,
    });
  }, []);

  const groupOfLayouts: GroupOfLayoutsDefinition = useMemo(
    () => calculateLayout(circlesDefinition),
    [circlesDefinition],
  );

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [scale] = useState<Scale>(1);
  const [position] = useState<Position>({
    x: 0,
    y: 0,
  });

  return (
    <div ref={divRef} className="aspect-square">
      <KonvaStage
        ref={(element: Stage | null) => {
          mainProvider.addToStageRefs(element, index);
        }}
        width={size.width}
        height={size.height}
        scale={{
          x: size.width / (CANVAS_SIZE + CANVAS_PADDING),
          y: size.height / (CANVAS_SIZE + CANVAS_PADDING),
        }}
      >
        <KonvaLayer
          ref={(element: Layer | null) => {
            mainProvider.addToLayerRefs(element, index);
          }}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
        >
          <KonvaGroup>
            {owner && (
              <ImageCircle
                label={owner.handle}
                source={owner.avatar}
                x={(CANVAS_SIZE + CANVAS_PADDING) / 2}
                y={(CANVAS_SIZE + CANVAS_PADDING) / 2}
                radius={CENTER_RADIUS}
                stroke={colours.circleBorders}
                strokeWidth={1}
                interactive={false}
              />
            )}
            {groupOfLayouts.map((circleLayout: LayoutDefinition, circleIndex: number) => (
              <Circle
                key={circleIndex}
                layout={circleLayout}
                items={circles[circleIndex]}
                interactive={false}
              />
            ))}
          </KonvaGroup>
        </KonvaLayer>
      </KonvaStage>
    </div>
  );
}

import Color from "color";
import { useAtom } from "jotai/index";
import type Konva from "konva";
import type { Layer } from "konva/lib/Layer";
import type { Stage } from "konva/lib/Stage";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Group as KonvaGroup,
  Image as KonvaImage,
  Layer as KonvaLayer,
  Rect as KonvaRect,
  Stage as KonvaStage,
  Text as KonvaText,
} from "react-konva";
import useImage from "use-image";
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
import {
  CANVAS_PADDING,
  CANVAS_SIZE,
  CENTER_RADIUS,
  WATERMARK,
} from "@/utils/constants";
import { getCenter } from "@/utils/get-center";
import { getDistance } from "@/utils/get-distance";
import {
  backgroundAtom,
  circlesDefinitionAtom,
  coloursAtom,
  friendsAtom,
  watermarkAtom,
} from "@/utils/maker-atom";

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
type Distance = number;
type Ratio = number;

type Colour = "#282c34" | "#ffffff";

type Size = {
  width: Width;
  height: Height;
};

type Position = {
  x: PositionX;
  y: PositionY;
};

type Crop = {
  x: PositionX;
  y: PositionY;
  width: Width;
  height: Height;
};

type Center = {
  x: PositionX;
  y: PositionY;
};

export default function KonvaVersion({
  index = 0,
  owner,
  circles,
}: KonvaProps) {
  const mainProvider = useContext(MainProviderContext);

  const [, setFriends] = useAtom(friendsAtom);
  const [circlesDefinition] = useAtom(circlesDefinitionAtom);
  const [backgroundImage] = useAtom(backgroundAtom);
  const [colours] = useAtom(coloursAtom);
  const [watermark] = useAtom(watermarkAtom);

  const toolbar = mainProvider.toolbarRef.current;

  useEffect(() => {
    setFriends(circles);
  }, [circles, setFriends]);

  const groupOfLayouts: GroupOfLayoutsDefinition = useMemo(
    () => calculateLayout(circlesDefinition),
    [circlesDefinition],
  );

  const [size, setSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [backgroundCrop, setBackgroundCrop] = useState<Crop>({
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scale, setScale] = useState<Scale>(1);
  const [lastDistance, setLastDistance] = useState<Distance>(0);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [lastCenter, setLastCenter] = useState<Center | null>(null);
  const [background] = useImage(backgroundImage?.source, "anonymous");

  useEffect(() => {
    const checkSize = (): void => {
      if (toolbar) {
        const width: Width = window.innerWidth;
        const height: Height = window.innerHeight;

        setSize({
          width,
          height,
        } as Size);

        const scale: Scale =
          width > height
            ? height / CANVAS_SIZE - 0.1
            : width / CANVAS_SIZE - 0.1;

        setScale(scale);

        setPosition({
          x: (width - (CANVAS_SIZE + CANVAS_PADDING) * scale) / 2,
          y: (height - (CANVAS_SIZE + CANVAS_PADDING) * scale) / 2,
        } as Position);

        if (backgroundImage) {
          const imageRatio: Ratio =
            backgroundImage.width / backgroundImage.height;

          let backgroundWidth = 0;
          let backgroundHeight = 0;

          if (1 >= imageRatio) {
            backgroundWidth = backgroundImage.width;
            backgroundHeight = backgroundImage.width / 1;
          } else {
            backgroundWidth = backgroundImage.height * 1;
            backgroundHeight = backgroundImage.height;
          }

          setBackgroundCrop({
            // Image position (center-middle)
            x: (backgroundImage.width - backgroundWidth) / 2,
            y: (backgroundImage.height - backgroundHeight) / 2,
            // Image size
            width: backgroundWidth,
            height: backgroundHeight,
          } as Crop);
        }
      }
    };

    checkSize();

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [toolbar, backgroundImage]);

  const backgroundColor = Color(colours.background);
  const watermarkColor: Colour = backgroundColor.isLight()
    ? "#282c34"
    : "#ffffff";

  const handleWheel = (event: Konva.KonvaEventObject<WheelEvent>): void => {
    event.evt.preventDefault();

    const layer: Layer = mainProvider.layersRef.current[index];
    const oldScale = layer.scaleX();
    const point = event.target.getStage()?.getPointerPosition();

    if (!point) {
      return;
    }

    const mousePointTo: {
      x: number;
      y: number;
    } = {
      x: point.x / oldScale - layer.x() / oldScale,
      y: point.y / oldScale - layer.y() / oldScale,
    };

    const newScale: number =
      event.evt.deltaY < 0 ? oldScale * 1.02 : oldScale / 1.02;

    if (newScale <= 0.3 || newScale > 2.2) {
      return;
    }

    setScale(newScale);
    setPosition({
      x: (point.x / newScale - mousePointTo.x) * newScale,
      y: (point.y / newScale - mousePointTo.y) * newScale,
    });
  };

  const handleTouchMove = (event: Konva.KonvaEventObject<TouchEvent>) => {
    event.evt.preventDefault();

    const layer: Layer = mainProvider.layersRef.current[index];

    const touches = event.evt.touches;
    const touch1 = touches.item(0);
    const touch2 = touches.item(1);

    if (!touch1 || !touch2) {
      return;
    }

    if (!layer.isDragging()) {
      layer.stopDrag();
    }

    const p1: {
      x: number;
      y: number;
    } = {
      x: touch1.clientX,
      y: touch1.clientY,
    };

    const p2: {
      x: number;
      y: number;
    } = {
      x: touch2.clientX,
      y: touch2.clientY,
    };

    const newCenter: Center = getCenter(p1, p2);

    if (!lastCenter) {
      setLastCenter(newCenter);
      return;
    }

    const distance: Distance = getDistance(p1, p2);

    if (!lastDistance) {
      setLastDistance(distance);
    }

    const pointTo: {
      x: PositionX;
      y: PositionY;
    } = {
      x: (newCenter.x - layer.x()) / layer.scaleX(),
      y: (newCenter.y - layer.y()) / layer.scaleX(),
    };

    const newScale: Scale = layer.scaleX() * (distance / lastDistance);

    if (newScale <= 0.3 || newScale > 2.2) {
      return;
    }

    setScale(newScale !== Number.POSITIVE_INFINITY ? newScale : 1);

    setPosition({
      x: newCenter.x - pointTo.x * newScale + (newCenter.x - lastCenter.x),
      y: newCenter.y - pointTo.y * newScale + (newCenter.y - lastCenter.y),
    } as Position);

    setLastDistance(distance);
    setLastCenter(newCenter);
  };

  const handleTouchEnd = () => {
    setLastDistance(0);
    setLastCenter(null);
  };

  return (
    <KonvaStage
      name="stage"
      ref={(element: Stage | null) => {
        mainProvider.addToStageRefs(element, index);
      }}
      width={size.width}
      height={size.height}
    >
      <KonvaLayer
        name="layer"
        ref={(element: Layer | null) => {
          mainProvider.addToLayerRefs(element, index);
        }}
        draggable
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
      >
        <KonvaGroup name="group">
          {!background && (
            <KonvaRect
              name="background"
              fill={colours.background}
              width={CANVAS_SIZE + CANVAS_PADDING}
              height={CANVAS_SIZE + CANVAS_PADDING}
              cornerRadius={(CANVAS_SIZE + CANVAS_PADDING) / 2}
            />
          )}
          {background && (
            <KonvaImage
              name="image"
              image={background}
              width={CANVAS_SIZE + CANVAS_PADDING}
              height={CANVAS_SIZE + CANVAS_PADDING}
              crop={backgroundCrop}
              cornerRadius={(CANVAS_SIZE + CANVAS_PADDING) / 2}
            />
          )}
          {owner && (
            <ImageCircle
              label={owner.handle}
              source={owner.avatar}
              x={(CANVAS_SIZE + CANVAS_PADDING) / 2}
              y={(CANVAS_SIZE + CANVAS_PADDING) / 2}
              radius={CENTER_RADIUS}
              stroke={colours.circleBorders}
              strokeWidth={1}
              interactive={true}
            />
          )}
          {groupOfLayouts.map(
            (circleLayout: LayoutDefinition, circleIndex: number) => (
              <Circle
                key={circleIndex}
                layout={circleLayout}
                items={circles[circleIndex]}
                interactive={true}
              />
            ),
          )}
          {watermark && (
            <KonvaText
              name="watermark"
              x={CANVAS_SIZE + CANVAS_PADDING - 200}
              y={CANVAS_SIZE + CANVAS_PADDING - 50}
              fontSize={30}
              text={WATERMARK}
              fill={watermarkColor}
            />
          )}
        </KonvaGroup>
      </KonvaLayer>
    </KonvaStage>
  );
}

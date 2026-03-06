import type { SceneContext } from "konva/lib/Context";
import { useState } from "react";
import {
  Group as KonvaGroup,
  Image as KonvaImage,
  Label as KonvaLabel,
  Tag as KonvaTag,
  Text as KonvaText,
} from "react-konva";
import useImage from "use-image";
import { DEFAULT_AVATAR } from "@/utils/constants";

type ImageCircleProps = {
  label: string;
  source: string;
  x: number;
  y: number;
  radius: number;
  stroke: string | "transparent";
  strokeWidth: number | 0;
  onClick?: () => void;
  onTap?: () => void;
  interactive: boolean;
};

export function ImageCircle({
  label,
  source,
  x,
  y,
  radius,
  stroke = "transparent",
  strokeWidth = 0,
  onClick = (): void => {},
  onTap = (): void => {},
  interactive = false,
}: ImageCircleProps) {
  const optimizedUrl = `/_next/image?url=${encodeURIComponent(source)}&w=256&q=75`;
  const [image, status] = useImage(optimizedUrl, "anonymous");
  const [placeholderImage] = useImage(`${DEFAULT_AVATAR}`, "anonymous");

  const avatar: HTMLImageElement | undefined =
    status === "loaded" ? image : placeholderImage;

  const scaleX: number = (2 * radius) / (avatar?.naturalWidth ?? 1);
  const scaleY: number = (2 * radius) / (avatar?.naturalHeight ?? 1);

  const [displayTooltip, setDisplayTooltip] = useState<boolean>(false);

  const onMouseEnter = (): void => {
    setTimeout((): void => {
      setDisplayTooltip(true);
    }, 150);
  };

  const onMouseLeave = (): void => {
    setTimeout((): void => {
      setDisplayTooltip(false);
    }, 150);
  };

  return (
    <KonvaGroup onMouseOver={onMouseEnter} onMouseOut={onMouseLeave}>
      <KonvaGroup
        x={x}
        y={y}
        clipFunc={(context: SceneContext): void => {
          context.arc(0, 0, radius, 0, Math.PI * 2, false);
        }}
      >
        <KonvaImage
          image={avatar}
          x={-radius}
          y={-radius}
          scaleX={scaleX}
          scaleY={scaleY}
          stroke={stroke}
          strokeWidth={strokeWidth}
          onClick={interactive ? onClick : (): void => {}}
          onTap={interactive ? onTap : (): void => {}}
        />
      </KonvaGroup>
      {interactive && displayTooltip && (
        <KonvaLabel x={x} y={y} opacity={0.8}>
          <KonvaTag
            fill="black"
            pointerDirection="down"
            pointerWidth={30}
            pointerHeight={10}
            lineJoin="round"
            shadowColor="black"
            cornerRadius={10}
          />
          <KonvaText
            text={`@${label}`}
            fill="white"
            fontSize={16}
            padding={10}
          />
        </KonvaLabel>
      )}
    </KonvaGroup>
  );
}

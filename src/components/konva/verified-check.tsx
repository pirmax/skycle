import { Group as KonvaGroup, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { VERIFIED_IMAGE_URL } from "@/utils/constants";

type VerifiedCheckProps = {
  x: number;
  y: number;
  radius: number;
};

export function VerifiedCheck({ x, y, radius }: VerifiedCheckProps) {
  const [image] = useImage(`${VERIFIED_IMAGE_URL}`, "anonymous");

  const scaleX: number = (0.8 * radius) / (image?.naturalWidth ?? 1);
  const scaleY: number = (0.8 * radius) / (image?.naturalHeight ?? 1);

  return (
    <KonvaGroup x={x + 60} y={y + 10}>
      <KonvaImage
        image={image}
        x={-radius}
        y={-radius}
        scaleX={scaleX}
        scaleY={scaleY}
      />
    </KonvaGroup>
  );
}

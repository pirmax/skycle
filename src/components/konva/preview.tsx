import dynamic from "next/dynamic";
import type { ComponentType, JSX } from "react";
import { useItemDistribution } from "@/hooks/use-item-distribution";
import type {
  GroupOfCirclesDefinition,
  OwnerProfileDefinition,
  VersionDefinition,
} from "@/types";

type KonvaProps = {
  index: number;
  owner: OwnerProfileDefinition;
  circles: GroupOfCirclesDefinition;
};

type PreviewProps = {
  index: number;
  type: "main" | "version";
  version: VersionDefinition;
};

const KonvaMainDynamic: ComponentType<KonvaProps> = dynamic(
  () => import("@/components/konva/konva-main"),
  {
    ssr: false,
  },
);

const KonvaVersionDynamic: ComponentType<KonvaProps> = dynamic(
  () => import("@/components/konva/konva-version"),
  {
    ssr: false,
  },
);

export function Preview({
  type,
  index = 0,
  version,
}: PreviewProps): JSX.Element {
  const circles: GroupOfCirclesDefinition = useItemDistribution(
    version.friends,
  );

  if (type === "version") {
    return (
      <KonvaVersionDynamic
        owner={version.own}
        circles={circles}
        index={index}
      />
    );
  } else if (type === "main") {
    return (
      <KonvaMainDynamic owner={version.own} circles={circles} index={index} />
    );
  }

  return <div />;
}

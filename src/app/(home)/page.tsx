import { fetchHandle } from "@/actions/skycle";
import { Hero } from "@/components/hero";
import type { VersionDefinition } from "@/types";
import { PREVIEW_EXAMPLE_USERNAME } from "@/utils/constants";

export default async function Page() {
  const data: VersionDefinition = await fetchHandle(
    PREVIEW_EXAMPLE_USERNAME,
    "this-year",
  );

  return <Hero data={data} />;
}

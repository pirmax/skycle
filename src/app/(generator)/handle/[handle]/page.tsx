import { notFound, redirect } from "next/navigation";
import type { JSX } from "react";
import { fetchHandle } from "@/actions/skycle";
import GeneratorPage from "@/components/pages/generator-page";
import type { ProfileDefinition } from "@/types";

type PageProps = {
  params: Promise<{
    handle: string;
  }>;
  searchParams: Promise<{
    period?: string | null;
  }>;
};

export default async function Page(props: PageProps): Promise<JSX.Element> {
  const searchParams = await props.searchParams;

  const {
    period = null
  } = searchParams;

  const params = await props.params;

  const {
    handle
  } = params;

  try {
    const data: {
      own: ProfileDefinition;
      friends: ProfileDefinition[];
    } = await fetchHandle(handle, period);

    if (!data) {
      notFound();
    }

    return <GeneratorPage handle={handle} data={data} />;
  } catch (_) {
    redirect("/404");
  }
}

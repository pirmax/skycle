import { IconCloudDownload, IconGitCompare } from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAtom } from "jotai/index";
import { toast } from "sonner";
import { Comparison } from "@/components/comparison";
import { Preview } from "@/components/konva/preview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { Version } from "@/generated/prisma/client";
import { selectedVersionAtom, selectedVersionIdAtom } from "@/utils/maker-atom";

export default function SheetVersions({ versions }: { versions: Version[] }) {
  const [, setSelectedVersion] = useAtom(selectedVersionAtom);
  const [selectedVersionId, setSelectedVersionId] = useAtom(
    selectedVersionIdAtom,
  );

  return (
    <Accordion type="single" collapsible>
      {versions.map((version: Version, index: number) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="w-full flex items-center justify-between">
              <span>{formatDistanceToNow(version.createdAt)}</span>
              <span className="text-xs text-muted-foreground mr-2">
                ({format(version.createdAt, "dd/MM/yyyy HH:mm")})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div
              key={index}
              className="bg-muted rounded-lg overflow-hidden mb-2"
            >
              <Preview
                version={JSON.parse(version.generatedData)}
                index={index + 1}
                type="version"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Drawer disablePreventScroll={true}>
                <DrawerTrigger asChild>
                  <Button
                    variant="default"
                    className="w-full"
                    disabled={selectedVersionId === index}
                  >
                    <IconGitCompare className="size-5 mr-2" />
                    <span>Comparison with actual version</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                  <div className="my-5 h-full overflow-y-auto">
                    <div className="mx-auto w-full max-w-3xl">
                      <Comparison
                        selectedVersion={JSON.parse(version.generatedData)}
                        currentData={JSON.parse(
                          versions[selectedVersionId].generatedData,
                        )}
                      />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              <Button
                variant="outline"
                onClick={(): void => {
                  setSelectedVersion(JSON.parse(version.generatedData));
                  setSelectedVersionId(index);
                  toast.success("Version loaded!", {
                    description:
                      "You can now compare this version with the current one.",
                  });
                }}
                className="w-full"
                disabled={selectedVersionId === index}
              >
                <IconCloudDownload className="size-5 mr-2" />
                <span>
                  {selectedVersionId === index
                    ? "This is the current version"
                    : "Load this version"}
                </span>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

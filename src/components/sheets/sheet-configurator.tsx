import {
  IconArrowsRandom,
  IconBrandUnsplash,
  IconCircleCheck,
  IconCircleDashed,
  IconCircles,
  IconClover,
  IconPalette,
  IconRestore,
} from "@tabler/icons-react";
import { useAtom } from "jotai/index";
import Image from "next/image";
import { type JSX, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { searchBackground } from "@/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { UnsplashResult } from "@/types";
import {
  MAX_CIRCLE,
  MAX_PEOPLE_PER_CIRCLE,
  MIN_CIRCLE,
  MIN_PEOPLE_PER_CIRCLE,
  PLACEHOLDER,
} from "@/utils/constants";
import {
  addCircleAtom,
  backgroundAtom,
  circlesDefinitionAtom,
  coloursAtom,
  removeCircleAtom,
  setColourAtom,
  setNumberOfItemsAtom,
  setRandomColoursAtom,
  verifiedAtom,
  watermarkAtom,
} from "@/utils/maker-atom";
import { ordinalNumbers } from "@/utils/ordinal-numbers";
import { sentenceCase } from "@/utils/sentence-case";

export function SheetConfigurator(): JSX.Element {
  const [circlesDefinition] = useAtom(circlesDefinitionAtom);
  const [colours] = useAtom(coloursAtom);
  const [watermark, setWatermark] = useAtom(watermarkAtom);
  const [verified, setVerified] = useAtom(verifiedAtom);
  const [, setBackgroundImage] = useAtom(backgroundAtom);
  const [, setColour] = useAtom(setColourAtom);
  const [, setRandomColours] = useAtom(setRandomColoursAtom);
  const [, addCircle] = useAtom(addCircleAtom);
  const [, removeCircle] = useAtom(removeCircleAtom);
  const [, setNumberOfItems] = useAtom(setNumberOfItemsAtom);

  const [query, setQuery] = useState<string>(PLACEHOLDER());
  const [backgrounds, setBackgrounds] = useState<UnsplashResult[]>([]);

  const onChangeHandle = useDebouncedCallback(
    async (query: string): Promise<void> => {
      if (query.length > 0) {
        setBackgrounds(await searchBackground(query));
      } else {
        setBackgrounds([]);
      }
    },
    500,
  );

  useEffect(() => {
    if (query.length > 0) {
      onChangeHandle(query);
    }
  }, [onChangeHandle, query]);

  const randomizeColor = (key: string) => {
    setColour(
      key,
      `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`,
    );

    toast.success("Color randomized!", {
      description: "You can now see the new color of your circle.",
    });
  };

  const setBackgroundMedia = (background: UnsplashResult | null): void => {
    if (background) {
      setBackgroundImage({
        source: background.urls.full,
        width: background.width,
        height: background.height,
      });

      setColour("background", background.color);

      toast.success("Background loaded!", {
        description: "You can now see the background of your circle.",
      });
    } else {
      setBackgroundImage({
        source: "",
        width: 0,
        height: 0,
      });

      // setColour('background', '#4e9ffe');

      toast.success("Background reset!", {
        description: "You can now see the default background of your circle.",
      });
    }
  };

  const handleCursorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = Number(event.target.value);
    const length = circlesDefinition.length;

    if (length < value) {
      for (let i = 0; i < value - length; i++) {
        addCircle();
      }
    } else {
      for (let i = 0; i < length - value; i++) {
        removeCircle();
      }
    }
  };

  return (
    <Accordion type="single" defaultValue="item-2">
      <AccordionItem value="item-0">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <IconCircleDashed className="size-5" />
            <span>How many circles do you want ?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Circles</CardTitle>
              <CardDescription>
                Drag the slider below to add or remove circles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="range"
                className="h-2 w-full appearance-none rounded-lg bg-blue-100"
                min={MIN_CIRCLE}
                max={MAX_CIRCLE}
                value={circlesDefinition.length}
                step={1}
                onChange={handleCursorChange}
              />
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <IconCircles className="size-5" />
            <span>How many friends per circle ?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
              <CardDescription>
                Drag the sliders below to adjust the number of friends you want
                to have per circle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {circlesDefinition.map(
                  (
                    circle: {
                      numberOfItems: number;
                    },
                    index: number,
                  ) => (
                    <div key={index}>
                      <label
                        htmlFor={`circle-${index}`}
                        className="flex items-center justify-between"
                      >
                        <span className="font-bold">
                          {ordinalNumbers(index + 1)} circle
                        </span>
                        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          {circle.numberOfItems}
                        </span>
                      </label>
                      <input
                        id={`circle-${index}`}
                        type="range"
                        className="h-2 w-full appearance-none rounded-lg bg-blue-100"
                        min={MIN_PEOPLE_PER_CIRCLE}
                        max={MAX_PEOPLE_PER_CIRCLE}
                        value={circle.numberOfItems}
                        step={1}
                        onChange={(e) =>
                          setNumberOfItems(index, Number(e.target.value))
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <IconBrandUnsplash className="size-5" />
            <span>What background do you want ?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
              <CardDescription>
                Look for the best background image so that your circle looks as
                attractive as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="search"
                placeholder={PLACEHOLDER()}
                onChange={(event) => setQuery(event.target.value)}
              />
              {backgrounds.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {backgrounds.slice(0, 9).map((background: UnsplashResult) => (
                    <Image
                      key={background.id}
                      onClick={() => setBackgroundMedia(background)}
                      src={background.urls.thumb}
                      alt={background.alt_description}
                      className="aspect-square object-cover rounded-lg"
                      width={background.width}
                      height={background.height}
                    />
                  ))}
                </div>
              )}
              <div className="mt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setBackgroundMedia(null)}
                  className="w-full"
                >
                  <IconRestore className="h-4 w-4 mr-2" />
                  <span>Reset background</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <IconPalette className="size-5" />
            <span>What colors do you want ?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>
                Customize all the colors of your circle, from the color of the
                joints, through the color of the circles, to the background
                color.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex flex-col space-y-3">
                {Object.entries(colours).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id={`${key}-colour`}
                        type="color"
                        value={value?.toString()}
                        onChange={(event) => setColour(key, event.target.value)}
                        className="bg-transparent border-none"
                      />
                      <label
                        className="ml-2 font-medium"
                        htmlFor={`${key}-colour`}
                      >
                        {sentenceCase(key)}
                      </label>
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => randomizeColor(key)}
                      >
                        <IconArrowsRandom className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setRandomColours();
                    toast.success("Colors randomized!", {
                      description:
                        "You can now see the new colors of your circle.",
                    });
                  }}
                  className="w-full"
                >
                  <IconClover className="size-4 mr-2" />
                  <span>Randomize colors</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center space-x-2">
            <IconCircleCheck className="size-5" />
            <span>More configuration ?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>More</CardTitle>
              <CardDescription>
                Our application works with the shares of our users, if you want
                to contribute to its success, you can leave the box checked
                above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="watermark-mode"
                    checked={watermark}
                    onCheckedChange={setWatermark}
                  />
                  <Label htmlFor="watermark-mode">Apply Skycle Watermark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified-mode"
                    checked={verified}
                    onCheckedChange={setVerified}
                  />
                  <Label htmlFor="verified-mode">Apply Verified Check</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

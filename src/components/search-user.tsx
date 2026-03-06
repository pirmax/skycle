"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconAt, IconHammer } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MainProviderContext } from "@/providers/main-provider";

const formSchema = z.object({
  handle: z.string().min(2).max(50),
  range: z.enum([
    "this-year",
    "last-six-months",
    "last-month",
    "seven-days",
    "today",
  ]),
});

export function SearchUser() {
  const router = useRouter();

  const { setIsLoading } = useContext(MainProviderContext);

  const [handle, setHandle] = useLocalStorage<string | null>("handle", null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: handle || "",
      range: "this-year",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      let handle: string = values.handle.replace("@", "").trim().toLowerCase();

      if (!handle.includes(".")) {
        handle = `${handle}.bsky.social`;
      }

      router.push(`/@${handle}?period=${values.range}`);

      setHandle(handle);

      toast.success(`We generated the circle for @${handle}`);
    } catch (_) {
      setIsLoading(false);
      toast.error("An error occurred while generating the circle");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="range"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    field.onBlur();
                  }}
                  className="flex items-center space-x-1 md:space-x-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="this-year" id="option-this-year" />
                    <Label htmlFor="option-this-year" className="truncate">
                      This year
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="last-six-months"
                      id="option-last-six-months"
                    />
                    <Label
                      htmlFor="option-last-six-months"
                      className="truncate"
                    >
                      Last 6 months
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last-month" id="option-last-month" />
                    <Label htmlFor="option-last-month" className="truncate">
                      Last month
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="seven-days" id="option-seven-days" />
                    <Label htmlFor="option-seven-days" className="truncate">
                      Last 7 days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="option-today" />
                    <Label htmlFor="option-today" className="truncate">
                      Today
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative drop-shadow-lg">
                  <FormLabel
                    htmlFor="search"
                    className="absolute top-1/2 left-4 -translate-y-1/2"
                  >
                    <IconAt className="size-7 text-foreground" />
                    <span className="sr-only">Search a Bluesky account</span>
                  </FormLabel>
                  <Input
                    {...field}
                    id="search"
                    placeholder="Search any account (as @jay.bsky.social or @pfrazee.com)"
                    autoFocus
                    className="w-full bg-background px-14 py-6 text-base focus:bg-background"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="default"
          className="flex w-full items-center space-x-3"
          size="lg"
        >
          <IconHammer className="size-4" />
          <span>Make my circle</span>
        </Button>
      </form>
    </Form>
  );
}

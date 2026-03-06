"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconDownload,
  IconTool,
  IconUpload,
  IconUsers,
  IconVersions,
} from "@tabler/icons-react";
import clsx from "clsx";
import Color from "color";
import { useAtom } from "jotai/index";
import Konva from "konva";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type JSX, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { loginToBluesky, uploadOnBluesky } from "@/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/iron";
import { cn } from "@/lib/utils";
import { MainProviderContext } from "@/providers/main-provider";
import { DEFAULT_POST_MESSAGE, EXPORT_FILE_NAME } from "@/utils/constants";
import { handleAtom } from "@/utils/maker-atom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const downloadFormSchema = z.object({
  name: z.string().optional(),
});

const uploadFormSchema = z.object({
  message: z.string().optional(),
});

export default function Toolbar({
  user,
  colors,
  setModal,
}: {
  user: User | null;
  colors: {
    background: string;
    circleBorders: string;
    connectingLines: string;
  };
  setModal: (name: string | null) => void;
}) {
  const pathname = usePathname();
  const router: AppRouterInstance = useRouter();
  const searchParams = useSearchParams();

  const [handle] = useAtom(handleAtom);

  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);

  const { layersRef, toolbarRef, setIsLoading } =
    useContext(MainProviderContext);

  const downloadForm = useForm<z.infer<typeof downloadFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      name: `${EXPORT_FILE_NAME}`,
    },
  });

  const uploadForm = useForm<z.infer<typeof uploadFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      message: `${DEFAULT_POST_MESSAGE}`,
    },
  });

  useEffect(() => {
    if (user && searchParams.has("upload")) {
      setUploadDialogOpen(true);
      setLoginDialogOpen(false);
      router.replace(pathname);
    } else if (!user && searchParams.has("upload")) {
      setLoginDialogOpen(true);
      setUploadDialogOpen(false);
      router.replace(pathname);
    }
  }, [user, searchParams, router, pathname]);

  async function onDownloadSubmit(values: z.infer<typeof downloadFormSchema>) {
    try {
      setIsLoading(true);

      const image: string | Blob | null = await exportCanvas("base64", 2);

      if (!image) {
        throw new Error("An error occurred while saving the circle.");
      }

      const linkElement: HTMLAnchorElement = document.createElement("a");
      linkElement.download = values.name || `${handle}-${EXPORT_FILE_NAME}`;
      linkElement.href = image as string;
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);

      toast.success("The circle was download on your device.");

      setDownloadDialogOpen(false);
      setLoginDialogOpen(false);
      setUploadDialogOpen(false);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message ||
          "An error occurred while downloading the circle.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onUploadSubmit(values: z.infer<typeof uploadFormSchema>) {
    try {
      setIsLoading(true);

      if (!user) {
        setUploadDialogOpen(false);
        setLoginDialogOpen(true);
        setIsLoading(false);

        return;
      }

      const image: string | Blob | null = await exportCanvas("blob", 1);

      if (!image) {
        throw new Error("An error occurred while saving the circle.");
      }

      const formData: FormData = new FormData();
      formData.append("image", image as Blob);
      formData.append("message", values.message ?? `${DEFAULT_POST_MESSAGE}`);

      const url = await uploadOnBluesky(formData);
      window.open(url, "_blank");

      toast.success("The circle was uploaded on Bluesky account.");

      setDownloadDialogOpen(false);
      setLoginDialogOpen(false);
      setUploadDialogOpen(false);
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        (error as Error).message ||
          "An error occurred while uploading the circle.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const exportCanvas = async (
    output: "base64" | "blob" = "base64",
    pixelRatio = 1,
    mimeType = "image/jpg",
  ): Promise<string | Blob | null> => {
    const originalLayer = layersRef.current[0];

    if (!originalLayer) {
      return null;
    }

    const layer: Konva.Layer = originalLayer.clone();
    const resetShapes: {
      shape: Konva.Rect | Konva.Image;
      originalRadius: number | number[];
    }[] = [];

    const groups = layer.getChildren().filter((node): node is Konva.Group => {
      return node instanceof Konva.Group && node.getAttr("name") === "group";
    });

    for (const group of groups) {
      const backgroundShapes = group
        .getChildren()
        .filter((child): child is Konva.Rect | Konva.Image => {
          return (
            (child instanceof Konva.Rect || child instanceof Konva.Image) &&
            (child.getAttr("name") === "background" ||
              child.getAttr("name") === "image")
          );
        });

      for (const shape of backgroundShapes) {
        const originalRadius = shape.cornerRadius?.() ?? 0;
        resetShapes.push({ shape, originalRadius });
        if (typeof shape.cornerRadius === "function") {
          shape.cornerRadius(0);
        }
      }
    }

    layer.scale({ x: 1, y: 1 });
    layer.position({ x: 0, y: 0 });

    let data: string | Blob | null = null;

    if (output === "base64") {
      data = layer.toDataURL({ mimeType, pixelRatio });
    } else if (output === "blob") {
      data = await new Promise<Blob | null>((resolve) =>
        layer.toBlob({ mimeType, pixelRatio, callback: resolve }),
      );
    }

    for (const { shape, originalRadius } of resetShapes) {
      if (typeof shape.cornerRadius === "function") {
        shape.cornerRadius(originalRadius);
      }
    }

    layer.destroy();
    return data;
  };

  const backgroundColour = Color(colors.background);

  const toolbarItems: {
    name: string;
    icon: JSX.Element;
    text: string;
    onClick: () => void;
  }[] = [
    {
      name: "customize",
      icon: <IconTool className="h-6 w-6 md:h-8 md:w-8" />,
      text: "Customize",
      onClick: () => {
        setModal("customize");
      },
    },
    {
      name: "friends",
      icon: <IconUsers className="h-6 w-6 md:h-8 md:w-8" />,
      text: "People",
      onClick: () => {
        setModal("friends");
      },
    },
    {
      name: "versions",
      icon: <IconVersions className="h-6 w-6 md:h-8 md:w-8" />,
      text: "Versions",
      onClick: () => {
        setModal("versions");
      },
    },
    {
      name: "download",
      icon: <IconDownload className="h-6 w-6 md:h-8 md:w-8" />,
      text: "Download",
      onClick: () => {
        setDownloadDialogOpen(true);
      },
    },
    {
      name: "upload",
      icon: <IconUpload className="h-6 w-6 md:h-8 md:w-8" />,
      text: "Upload",
      onClick: () => {
        if (user) {
          setUploadDialogOpen(true);
        } else {
          setLoginDialogOpen(true);
        }
      },
    },
  ];

  return (
    <>
      <div
        ref={toolbarRef}
        className={clsx(
          "group fixed inset-x-0 bottom-0 left-0 z-40 border-t bg-transparent lg:inset-x-auto lg:inset-y-0 lg:max-w-lg lg:border-t-0 lg:border-r",
          {
            "border-black": backgroundColour.isLight(),
            "border-white": backgroundColour.isDark(),
          },
        )}
        style={{
          backgroundColor: `${colors.background}`,
        }}
      >
        <div className="flex h-20 select-none flex-row content-center items-center justify-between lg:h-screen lg:flex-col">
          <Link
            href="/"
            className="hidden aspect-square p-5 lg:block"
            onClick={(event) => {
              event.preventDefault();
              router.push("/");
              router.refresh();
            }}
          >
            <Image
              src="/logo.gif"
              alt="Skycle"
              className="size-32"
              width="480"
              height="480"
              priority
            />
          </Link>
          {toolbarItems.map(
            (
              item: {
                name: string;
                icon: JSX.Element;
                text: string;
                onClick: () => void;
              },
              index: number,
            ) => (
              <button
                key={item.name}
                tabIndex={index}
                className={cn(
                  "group flex h-full w-full flex-col items-center justify-center space-y-2 bg-transparent px-3 py-2 text-center font-bold hover:bg-primary/50 hover:drop-shadow-lg",
                  {
                    // '': item.name === modal,
                    "text-black": backgroundColour.isLight(),
                    "text-white": backgroundColour.isDark(),
                  },
                )}
                type="button"
                onClick={item.onClick}
              >
                {item.icon}
                <span className="truncate font-bold text-xs uppercase tracking-tighter lg:text-lg">
                  {item.text}
                </span>
              </button>
            ),
          )}
        </div>
      </div>
      <Form {...downloadForm}>
        <AlertDialog
          open={downloadDialogOpen}
          onOpenChange={setDownloadDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to download this circle ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                The circle image will be downloaded to your device and then you
                can easily share it on Bluesky.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={downloadForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                type="submit"
                disabled={downloadForm.formState.isSubmitting}
                onClick={() => downloadForm.handleSubmit(onDownloadSubmit)()}
              >
                Download
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
      <Form {...uploadForm}>
        <AlertDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure to upload this circle on Bluesky ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                The circle image will be uploaded to Bluesky and then you can
                easily share it with your friends.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={uploadForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                type="submit"
                disabled={uploadForm.formState.isSubmitting}
                onClick={() => uploadForm.handleSubmit(onUploadSubmit)()}
              >
                Upload
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
      <AlertDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You must be logged in to upload this circle on Bluesky.
            </AlertDialogTitle>
            <AlertDialogDescription>
              To upload this circle and interact with your account, you need to
              be logged in on Bluesky. If you’re not, click on the button and
              you’ll be redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event): Promise<void> => {
                event.preventDefault();

                if (!handle) {
                  toast.error("Handle is required.");
                  return;
                }

                try {
                  setIsLoading(true);
                  const url: string = await loginToBluesky(handle);
                  toast.success("You are now logged in on Bluesky.");
                  router.push(url);
                } catch (error: unknown) {
                  setIsLoading(false);
                  toast.error(
                    (error as Error).message ||
                      "An error occurred while logging in on Bluesky.",
                    {
                      description:
                        "Please try again. If the problem persists, contact the support.",
                    },
                  );
                }
              }}
            >
              Login as @{handle}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

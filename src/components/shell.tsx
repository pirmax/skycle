"use client";

import { IconLoader } from "@tabler/icons-react";
import Color from "color";
import { useAtom } from "jotai/index";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { destroyTheSession } from "@/actions";
import SheetBase from "@/components/sheets/sheet-base";
import { SheetConfigurator } from "@/components/sheets/sheet-configurator";
import SheetFriends from "@/components/sheets/sheet-friends";
import SheetVersions from "@/components/sheets/sheet-versions";
import Toolbar from "@/components/toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Version } from "@/generated/prisma/client";
import type { User } from "@/lib/iron";
import { coloursAtom, loadingAtom, modalAtom } from "@/utils/maker-atom";

export function Shell({
  user,
  versions,
  children,
}: {
  user: User | null;
  versions: Version[];
  children: ReactNode;
}) {
  const router: AppRouterInstance = useRouter();

  const [modal, setModal] = useAtom(modalAtom);
  const [loading] = useAtom(loadingAtom);
  const [colours] = useAtom(coloursAtom);

  const backgroundColor = Color(colours.background);
  const mainColor: string = backgroundColor.isLight() ? "#282c34" : "#ffffff";

  return (
    <div
      className="fixed size-full"
      style={{ backgroundColor: colours.background }}
    >
      <SheetBase
        modal={modal}
        setModal={setModal}
        name="customize"
        title="Customize"
        description="Skycle allows you to customize your circles of friends, you can add up to 9 and configure the number of friends per circle. You can also change the background color as well as the links and outlines of the circles."
      >
        <SheetConfigurator />
      </SheetBase>

      <SheetBase
        modal={modal}
        setModal={setModal}
        name="friends"
        title="People"
        description="Skycle fetches a number of your most recent skeets and/or likes. Then, it counts the number of interactions you've had with each person and assigns them a score."
      >
        <SheetFriends />
      </SheetBase>

      <SheetBase
        modal={modal}
        setModal={setModal}
        name="versions"
        title="Versions"
        description="Watch, analyze, and compare the evolution of your circles in each recorded version."
      >
        <SheetVersions versions={versions} />
      </SheetBase>

      <div className="transition bottom-18 fixed inset-0 z-10 md:bottom-24">
        {children}
      </div>

      <div className="absolute z-50 top-10 right-10">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-14 cursor-pointer shadow-2xl">
                <AvatarImage src={user.avatar || ""} alt={user.handle} />
                <AvatarFallback>
                  {user.handle.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>@{user.handle}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  await destroyTheSession();
                  router.refresh();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!modal && loading && (
        <div className="absolute z-50 top-0 right-0 m-5">
          <IconLoader
            className="h-6 md:h-10 w-auto animate-spin"
            style={{ color: mainColor }}
          />
        </div>
      )}

      <Toolbar user={user} colors={colours} setModal={setModal} />
    </div>
  );
}

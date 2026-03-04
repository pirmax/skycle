import {
  IconBrandBluesky,
  IconBubbleText,
  IconDotsVertical,
  IconEyeOff,
  IconHelpCircle,
} from "@tabler/icons-react";
import { useAtom } from "jotai/index";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileDefinition } from "@/types";
import { SCORES } from "@/utils/constants";
import { friendsAtom, hideFriendAtom, unHideFriendsAtom } from "@/utils/maker-atom";
import { ordinalNumbers } from "@/utils/ordinal-numbers";

export default function SheetFriends() {
  const [friends] = useAtom(friendsAtom);
  const [, hideFriend] = useAtom(hideFriendAtom);
  const [, unHideFriends] = useAtom(unHideFriendsAtom);

  return (
    <>
      <Alert>
        <IconBubbleText className="h-4 w-4" />
        <AlertTitle>Just a little tip!</AlertTitle>
        <AlertDescription>
          You can also hide friends by clicking on their avatar in the circle preview. But you can
          unhide them all at once by clicking the button below.
        </AlertDescription>
      </Alert>
      <div className="mt-2 flex flex-col items-center justify-center">
        <Button
          type="button"
          variant="default"
          onClick={(): void => {
            unHideFriends();

            toast.success("All hidden users are now visible!", {
              description: "You can now see all your friends in the circles.",
            });
          }}
          className="w-full"
        >
          Show all hidden users
        </Button>
      </div>
      <Separator className="my-5" />
      <Accordion type="single" collapsible defaultValue={`item-0`}>
        {friends.map((circle: ProfileDefinition[], index: number) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline">
              <span className="w-full flex items-center justify-between pr-2">
                <span>{ordinalNumbers(index + 1)} circle</span>
                <span className="text-xs text-muted-foreground">
                  {circle.length} {circle.length > 1 ? "friends" : "friend"}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 flex flex-col space-y-2">
                {circle.length > 0 &&
                  circle.map((friend: ProfileDefinition, index: number) => (
                    <div key={index} className="w-full flex items-center justify-between space-x-3">
                      <div className="flex items-center space-x-2 truncate">
                        <Avatar className="size-12">
                          <AvatarImage
                            src={`/_next/image?url=${encodeURIComponent(friend.avatar)}&w=256&q=75`}
                            alt={friend.handle}
                          />
                          <AvatarFallback>
                            <Image
                              src={`/placeholder.png`}
                              alt={friend.handle}
                              width={500}
                              height={500}
                              className="size-full"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs flex flex-col truncate leading-4">
                          <span className="truncate font-medium text-foreground">
                            {friend.displayName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            @{friend.handle}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Popover>
                          <PopoverTrigger>
                            <span className="flex items-center space-x-1 whitespace-nowrap text-xs px-2">
                              <span>
                                {friend.score} {friend.score > 1 ? "points" : "point"}
                              </span>
                              <IconHelpCircle className="size-4 text-gray-400" />
                            </span>
                          </PopoverTrigger>
                          <PopoverContent side="right" className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">Score explanation</h4>
                                <p className="text-sm text-muted-foreground">
                                  This score is calculated based on the interactions you have with
                                  this user.
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="handle">Handle</Label>
                                  <Input
                                    id="handle"
                                    defaultValue={`@${friend.handle}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="base">Base</Label>
                                  <Input
                                    id="base"
                                    defaultValue={`${SCORES.base} ${SCORES.base > 1 ? "points" : "point"}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="mentions">Mentions</Label>
                                  <Input
                                    id="mentions"
                                    defaultValue={`${friend.interactions?.mentions} ${(friend.interactions?.mentions ?? 0 > 1) ? "mentions" : "mention"} * ${SCORES.perMentions} ${SCORES.perMentions > 1 ? "points" : "point"}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="quotes">Quotes</Label>
                                  <Input
                                    id="quotes"
                                    defaultValue={`${friend.interactions?.quotes} ${(friend.interactions?.quotes ?? 0 > 1) ? "quotes" : "quote"} * ${SCORES.perQuotes} ${SCORES.perQuotes > 1 ? "points" : "point"}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="shares">Shares</Label>
                                  <Input
                                    id="shares"
                                    defaultValue={`${friend.interactions?.shares} ${(friend.interactions?.shares ?? 0 > 1) ? "shares" : "share"} * ${SCORES.perShares} ${SCORES.perShares > 1 ? "points" : "point"}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="replies">Replies</Label>
                                  <Input
                                    id="replies"
                                    defaultValue={`${friend.interactions?.replies} ${(friend.interactions?.replies ?? 0 > 1) ? "replies" : "reply"} * ${SCORES.perReplies} ${SCORES.perReplies > 1 ? "points" : "point"}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <Label htmlFor="score">Score</Label>
                                  <Input
                                    id="score"
                                    defaultValue={`${friend.score} ${friend.score > 1 ? "points" : "point"}`}
                                    className="col-span-2 h-8"
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <DropdownMenu key={friend.did}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconDotsVertical className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={friend.url} target="_blank">
                                <IconBrandBluesky className="size-4 text-black mr-2" />
                                <span>View on Bluesky</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(): void => {
                                hideFriend(friend.did);

                                toast.success(`@${friend.handle} hidden!`, {
                                  description: "This user will not be visible in the circles.",
                                });
                              }}
                            >
                              <IconEyeOff className="size-4 text-black mr-2" />
                              <span>Hide this user</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                {circle.length === 0 && <p className="text-sm">No users in this circle.</p>}
              </div>
              <div className="mt-5 bg-gray-100 p-3 rounded-lg">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium leading-6 text-gray-900 ml-2"
                >
                  All friends in the {ordinalNumbers(index + 1)} circle
                </label>
                <div className="mt-1">
                  <Textarea
                    rows={5}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={circle
                      .map((friend: ProfileDefinition): string => `@${friend.handle}`)
                      .join(" ")}
                    onClick={async (
                      event: React.MouseEvent<HTMLTextAreaElement>,
                    ): Promise<void> => {
                      event.currentTarget.select();
                      await navigator.clipboard.writeText(event.currentTarget.value);

                      toast.success("Copied to clipboard!", {
                        description: "Paste mentions, directly on your Bluesky skeet.",
                      });
                    }}
                  />
                  <p className="text-xs mt-1 ml-2">
                    Copy and paste directly on your Bluesky skeet.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

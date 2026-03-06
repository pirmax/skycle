"use client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ProfileDefinition, VersionDefinition } from "@/types";

import type { JSX } from "react";

type ComparisonProps = {
  selectedVersion: VersionDefinition;
  currentData: VersionDefinition;
};

export function Comparison({
  selectedVersion,
  currentData,
}: ComparisonProps): JSX.Element {
  const { appeared, disappeared } = compareFriends(
    selectedVersion,
    currentData,
  );

  return (
    <>
      <h2 className="font-bold text-3xl text-center">Friends comparison</h2>
      <div className="my-10 w-full flex items-start justify-center space-x-5">
        <div className="flex-1">
          <h3 className="w-full font-semibold mb-2 flex items-center justify-end space-x-2 uppercase tracking-tight text-sm">
            <Badge>{appeared.length}</Badge>
            <span>Friends appeared</span>
          </h3>
          {appeared.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No friends appeared.
            </p>
          ) : (
            <div className="flex flex-col space-y-2 text-right">
              {appeared.map((friend: ProfileDefinition) => (
                <div
                  key={friend.did}
                  className="flex items-center justify-end space-x-2 truncate"
                >
                  <div className="max-w-xs flex flex-col truncate leading-4">
                    <Link
                      href={`https://bsky.app/profile/${friend.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-medium text-foreground"
                    >
                      {friend.displayName}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      @{friend.handle}
                    </span>
                  </div>
                  <Link
                    href={`https://bsky.app/profile/${friend.handle}`}
                    target="_blank"
                    rel="noreferrer"
                  >
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
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="w-full font-semibold mb-2 flex items-center justify-start space-x-2 uppercase tracking-tight text-sm">
            <span>Friends disappeared</span>
            <Badge>{disappeared.length}</Badge>
          </h3>
          {disappeared.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No friends disappeared.
            </p>
          ) : (
            <div className="flex flex-col space-y-2">
              {disappeared.map((friend: ProfileDefinition) => (
                <div
                  key={friend.did}
                  className="flex items-center justify-start space-x-2 truncate"
                >
                  <Link
                    href={`https://bsky.app/profile/${friend.handle}`}
                    target="_blank"
                    rel="noreferrer"
                  >
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
                  </Link>
                  <div className="max-w-xs flex flex-col truncate leading-4">
                    <Link
                      href={`https://bsky.app/profile/${friend.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-medium text-foreground"
                    >
                      {friend.displayName}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      @{friend.handle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

type ComparisonResult = {
  appeared: ProfileDefinition[];
  disappeared: ProfileDefinition[];
};

function compareFriends(
  base: VersionDefinition,
  other: VersionDefinition,
): ComparisonResult {
  const baseDids = new Set(base.friends.map((f) => f.did));
  const otherDids = new Set(other.friends.map((f) => f.did));

  // Utilisateurs apparus dans "other" mais pas dans "base"
  const appeared = other.friends.filter((f) => !baseDids.has(f.did));
  // Utilisateurs disparus de "base" qui ne sont plus dans "other"
  const disappeared = base.friends.filter((f) => !otherDids.has(f.did));

  return { appeared, disappeared };
}

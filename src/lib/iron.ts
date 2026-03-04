"use server";

import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export type User = {
  did: string;
  handle: string;
  avatar: string | null;
};

const getSession = async (): Promise<
  IronSession<{
    user: User | null;
  }>
> => {
  return await getIronSession<{
    user: User | null;
  }>(await cookies(), {
    cookieName: "sid",
    password: process.env.COOKIE_PASSWORD as string,
  });
};

export default getSession;

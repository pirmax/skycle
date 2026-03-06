import crypto from "node:crypto";
import redis from "@/lib/redis";

const getKey = (name: string): string => {
  return crypto.createHash("md5").update(name).digest("hex");
};

const getCache = async (name: string): Promise<string | null> => {
  const key: string = getKey(name);
  const data = await redis.get(key);
  return JSON.parse(data || "null");
};

const setCache = async (
  name: string,
  data: string | object,
  time: number,
): Promise<void> => {
  const key: string = getKey(name);
  await redis.set(key, JSON.stringify(data), "EX", time);
};

const cache = { getCache, setCache };

export default cache;

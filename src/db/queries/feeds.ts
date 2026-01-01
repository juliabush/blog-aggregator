import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, user_id: number) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: user_id })
    .returning();
  return result;
}

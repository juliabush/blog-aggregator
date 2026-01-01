import { db } from "..";
import { feeds } from "../schema";
import type { User } from "../queries/users";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: user_id })
    .returning();
  return result;
}

export type Feed = typeof feeds.$inferSelect;

export async function printFeed(Feed: Feed, User: User) {
  console.log(Feed);
  console.log(User);
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

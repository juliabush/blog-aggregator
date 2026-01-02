import { db } from "..";
import { feeds } from "../schema";
import type { User } from "../queries/users";
import { eq, sql } from "drizzle-orm";

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

export async function markFeedFetched(feed_id: string) {
  const now = new Date();

  await db
    .update(feeds)
    .set({ last_fetched_at: now, updatedAt: now })
    .where(eq(feeds.id, feed_id));
}

export async function getNextFeedToFetch() {
  const [nextFeed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`last_fetched_at NULLS FIRST`)
    .limit(1);

  if (!nextFeed) {
    console.log("No feeds avaliable to fetch");
    return null;
  }

  return nextFeed;
}

import { db } from "..";
import { feeds } from "../schema";
import type { User } from "../queries/users";
import { eq, sql } from "drizzle-orm";
import { fetchFeed } from "../../fetchFeed";
import { createPost } from "./posts";

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

export async function scrapeFeeds() {
  const next_feed = await getNextFeedToFetch();
  if (!next_feed) {
    console.log("No feeds avaliable to scrape.");
    return;
  }
  await markFeedFetched(next_feed.id);

  let fetched_feed;
  if (next_feed.url === null) {
    console.error("cannot fetch feed with null value");
  } else {
    fetched_feed = await fetchFeed(next_feed.url);
  }
  if (fetched_feed === undefined) {
    console.error("Cannot loop through undefined fetched_feed");
  } else {
    for (const item of fetched_feed.channel.item) {
      const publishedAt = new Date(item.pubDate || Date.now());

      try {
        await createPost(
          item.title ?? "Untitled",
          item.link ?? "",
          item.description ?? "",
          next_feed.id
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.message?.includes("duplicate key")) {
          continue;
        }
        console.error("Error saving post:", err);
      }
    }
  }

  console.log(`Finished fetching: ${next_feed.name}`);
}

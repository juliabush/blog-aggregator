import { db } from "..";
import { feed_follow, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(user_id: string, feed_id: string) {
  const [newFeedFollow] = await db
    .insert(feed_follow)
    .values({ user_id, feed_id })
    .returning();
  const joinedResult = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follow)
    .innerJoin(feeds, eq(feed_follow.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follow.user_id, users.id))
    .where(eq(feed_follow.id, newFeedFollow.id));
  return joinedResult[0];
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getFeedFollowersForUser() {}

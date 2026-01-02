import { db } from "..";
import { feed_follow, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";

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

export async function getFeedFollowsForUser(user_id: string) {
  const result = await db
    .select({
      id: feed_follow.id,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follow)
    .innerJoin(feeds, eq(feed_follow.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follow.user_id, users.id))
    .where(eq(feed_follow.user_id, user_id));

  return result;
}

export async function deleteFeedFollow(user_id: string, url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found`);
  }
  const [result] = await db
    .delete(feed_follow)
    .where(
      and(eq(feed_follow.user_id, user_id), eq(feed_follow.feed_id, feed.id))
    );
}

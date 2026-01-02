import { db } from "..";
import { feed_follow } from "../schema";

export async function createFeedFollow() {
  const [newFeedFollow] = await db
    .insert(feed_follow)
    .select({ user_id, feed_id })
    .returning();
  const joinedResult = await db
    .select({})
    .from(feed_follow)
    .innerJoin(feeds, eq(feed_follow.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follow.user_id, users.id))
    .where(eq(feed_follow.user_id, users.id));
}

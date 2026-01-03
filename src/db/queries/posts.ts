import { db } from "..";
import { posts } from "../schema";
import { feeds } from "../schema";
import { users } from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(
  title: string,
  url: string,
  description: string,
  feed_id: string
) {
  const [result] = await db
    .insert(posts)
    .values({
      title: title,
      url: url,
      description: description,
      feed_id: feed_id,
    })
    .returning();
  return result;
}

export async function getPostsForUser(user_id: string) {
  const all_posts = await db.select().from(posts);
  const joinedResult = await db
    .select({
      feedName: feeds.user_id,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(posts, eq(posts.feed_id, feeds.id))
    .innerJoin(users, eq(feeds.user_id, users.id))
    .where(eq(feeds.user_id, user_id))
    .orderBy(desc(posts.published_at));
  return joinedResult[0];
}

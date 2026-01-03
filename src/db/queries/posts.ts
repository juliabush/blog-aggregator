import { db } from "..";
import { posts } from "../schema";

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

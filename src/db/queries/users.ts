import { db } from "..";
import { users } from "../schema";
import { feeds } from "../schema";
import { posts } from "../schema";
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function fetchUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}

export async function deleteAllUsers() {
  await db.delete(posts);
  await db.delete(feeds);
  await db.delete(users);
}

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function getUserById(id: string) {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
}

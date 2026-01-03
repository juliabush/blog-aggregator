import { setUser, readConfig } from "./config";
import {
  createUser,
  fetchUser,
  deleteAllUsers,
  getUsers,
  getUserById,
} from "./db/queries/users";
import { fetchFeed } from "./fetchFeed";
import {
  createFeed,
  getFeeds,
  printFeed,
  scrapeFeeds,
} from "./db/queries/feeds";
import {
  getFeedByUrl,
  createFeedFollow,
  getFeedFollowsForUser,
  deleteFeedFollow,
} from "./db/queries/feed_follow";

import { getPostsForUser } from "./db/queries/posts";

import type { User } from "./db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const username = args[0];
  const user = await fetchUser(username);
  if (!user) {
    throw new Error("Cannot login with nonexistant account");
  }

  setUser(user.name);
  console.log("User has been set");
}

export async function handlerRegisterUser(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const potencialUser = args[0];

  let checkUser = await fetchUser(potencialUser);
  if (checkUser) {
    throw new Error("User already exists");
  }
  const user = await createUser(potencialUser);
  setUser(user.name);
  console.log("New user has been registered");
}

export async function handlerReset(cmdName: string) {
  try {
    await deleteAllUsers();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export async function handlerUsers(cmdName: string) {
  try {
    const all_users = await getUsers();
    for (const user of all_users) {
      const cfg = readConfig();
      if (user.name === (await cfg.currentUserName)) {
        console.log(`* ${user.name} (current)`);
      } else {
        console.log(`* ${user.name}`);
      }
    }
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs`);
  }

  const durationStr = args[0];
  const timeBetweenRequests = parseDuration(durationStr);

  console.log(`Collecting feeds every ${durationStr}...`);

  scrapeFeeds().catch((err) => console.error("Initial scrape error:", err));
  // im assuming i need to call createPost here
  const interval = setInterval(() => {
    scrapeFeeds().catch((err) => console.error("Scrape error:", err));
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\nShutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function addfeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length < 2) {
    process.exit(1);
  }
  try {
    const feed = await createFeed(args[0], args[1], user.id);
    const feed_follow = await createFeedFollow(user.id, feed.id);
    console.log(`Feed: ${feed.name}, Followed by: ${user.name}`);
    process.exit(0);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
}

export async function fetchFeeds(cmdName: string) {
  const all_feeds = await getFeeds();
  if (all_feeds.length === 0) {
    console.log("No feeds found");
  }
  for (const feed of all_feeds) {
    const user = await getUserById(feed.user_id);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
  }
}

export async function newFeedFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length === 0) {
    console.log("Must provide a url as argument");
    process.exit(1);
  }
  const result = await getFeedByUrl(args[0]);
  const createFeed = await createFeedFollow(user.id, result.id);

  console.log(
    `Feed: ${createFeed.feedName}, Followed by: ${createFeed.userName}`
  );
}

export async function currentlyFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const follows = await getFeedFollowsForUser(user.id);

  for (const follow of follows) {
    console.log(`- ${follow.feedName}`);
  }

  process.exit(0);
}

export async function handlerDelete(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length === 0) {
    console.log(`Usage: ${cmdName} <feed-url>`);
    process.exit(1);
  }
  try {
    const message = await deleteFeedFollow(user.id, args[0]);
    console.log(message);
    process.exit(0);
  } catch (error) {
    console.error(`failed to delete feed follow: ${error}`);
    process.exit(1);
  }
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error("Invalid duration format. Use ms, s, m or h.");
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error("Unsupported time unit.");
  }
}

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const limit = args.length === 0 ? 2 : Number(args[0] || 2);

  const latest_posts = await getPostsForUser(user.id);
  for (const post of latest_posts.slice(0, limit)) {
    console.log(post);
  }
}

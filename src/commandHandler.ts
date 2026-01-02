import { setUser, readConfig } from "./config";
import {
  createUser,
  fetchUser,
  deleteAllUsers,
  getUsers,
  getUserById,
} from "./db/queries/users";
import { fetchFeed } from "./fetchFeed";
import { createFeed, getFeeds, printFeed } from "./db/queries/feeds";
import { getFeedByUrl, createFeedFollow } from "./db/queries/feed_follow";

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

// export async function handlerAgg(cmdName: string, ...args: string[]) {
//   const feed = await fetchFeed(args[0]);
//   console.log(feed);
// }
export async function handlerAgg(cmdName: string) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  // console.log(feed);
  console.log(JSON.stringify(feed, null, 2));
}

export async function addfeed(cmdName: string, ...args: string[]) {
  if (args.length < 2) {
    process.exit(1);
  }
  try {
    const cfg = readConfig();
    const user_id = await fetchUser(cfg.currentUserName);
    const feed = await createFeed(args[0], args[1], user_id.id);
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

export async function newFeedFollow(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    console.log("Must provide a url as argument");
    process.exit(1);
  }
  const result = await getFeedByUrl(args[0]);
  const cfg = readConfig();
  const user_id = await fetchUser(cfg.currentUserName);
  const createFeed = await createFeedFollow(user_id.id, result.id);
  console.log(
    `Feed: ${createFeed.feedName}, Followed by: ${createFeed.userName}`
  );
}

export async function currentlyFollowing(cmdName: string, ...args: string[]) {}

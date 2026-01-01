import { setUser, readConfig } from "./config";
import {
  createUser,
  fetchUser,
  deleteAllUsers,
  getUsers,
} from "./db/queries/users";
import { fetchFeed } from "./fetchFeed";

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
  console.log(feed);
}

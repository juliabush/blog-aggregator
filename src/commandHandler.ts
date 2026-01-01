import { setUser } from "./config";
import { createUser, fetchUser } from "./db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Commands array is empty");
  }
  const username = args[0];
  let checkUsername = await fetchUser(username);
  if (!checkUsername) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  setUser(username);
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

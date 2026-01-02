import { readConfig } from "./config";
import { fetchUser } from "./db/queries/users";
import type { User } from "./db/queries/users";
import type { CommandHandler } from "./commandHandler";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(
  handler: (cmdName: string, user: User, ...args: string[]) => Promise<void>
): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const cfg = readConfig();

    if (!cfg.currentUserName) {
      throw new Error("No user is currently logged in.");
    }

    const user = await fetchUser(cfg.currentUserName);
    if (!user) {
      throw new Error(`User ${cfg.currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
